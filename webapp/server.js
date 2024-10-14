const { runRefreshScript, triggerMainScript } = require('./server/helpers');
const { displayIsBusy, DisplayStatus } = require('./server/status');
const express = require('express');
const enableWs = require('express-ws');

const app = express();
enableWs(app);

const events = require('events');

const emitter = new events.EventEmitter();
const port = process.env.PORT || 3000;
const path = require('path');
const { spawn, exec } = require('child_process');
const bodyParser = require('body-parser');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '.');
  },
  filename: (req, file, cb) => {
    console.log(file);
    let filetype = '';
    if (file.mimetype === 'image/gif') {
      filetype = 'gif';
    }
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    cb(null, `image-to-print.${filetype}`);
  },
});
const upload = multer({ storage });
const fs = require('fs');
const { sendLog, watchForLogChanges } = require('./server/watch-logs');

const displayStatus = new DisplayStatus(emitter);

function dispatchStatusUpdateEvent() {
  emitter.emit(displayStatus.UPDATE_EVENT);
}

function getCurrentDateTime() {
  return new Date().toLocaleString('en-US');
}

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(bodyParser.json());

// Update display status
app.post('/api/display-status', (req, res) => {
  console.log('Request body: ', req.body);
  res.setHeader('content-type', 'application/json');
  if (req.body) {
    displayStatus.lastRefresh = getCurrentDateTime();
    displayStatus.message = req.body.message || '';
    displayStatus.isError = req.body.isError;
    displayStatus.isProcessing = req.body.isProcessing;
    dispatchStatusUpdateEvent();
    res.status(200);
    res.send(JSON.stringify(displayStatus));
  } else {
    res.status(400);
    res.send(
      JSON.stringify({
        code: 400,
        message: 'No message sent in request body.',
      })
    );
  }
});

// Returns requested number of lines of main python log
app.get('/api/logs/python/:numOfLines', (req, res) => {
  res.setHeader('content-type', 'application/json');
  const val = req.params.numOfLines;
  const int = parseInt(val);
  if (!Number.isInteger(int)) {
    res.status(400);
    res.send(
      JSON.stringify({
        code: 400,
        message: 'Invalid call to api. Route param must be valid number.',
      })
    );
  } else if (int <= 0) {
    res.status(400);
    res.send(
      JSON.stringify({
        code: 400,
        message: 'Invalid call to api. Route param must be greater than 0.',
      })
    );
  } else if (int > 500) {
    res.status(400);
    res.send(
      JSON.stringify({
        code: 400,
        message: 'Invalid call to api. Route param must be equal to or less than 500.',
      })
    );
  } else {
    res.status(200);
    sendLog(res, val);
  }
});

// Send image to show on display
app.post('/api/send-image', upload.single('file'), (req, res) => {
  displayStatus.isWaiting = false;

  if (!req.file) {
    const errorMsg = 'No image received.';
    res.status(500);
    res.send({
      code: 500,
      message: errorMsg,
    });
  }

  const imageName = req.file.filename;

  if (!displayStatus.isProcessing) {
    let dataToSend = {};
    console.log(`Sending image path to script: ${imageName}`);
    displayStatus.setSuccess(`Received image: ${imageName}`);
    // Pass message to python script
    const python = spawn('python', ['../python/printimage.py', imageName]);

    // Output from script
    python.stdout.on('data', function (data) {
      const output = data.toString();
      try {
        dataToSend = JSON.parse(output);
      } catch (e) {
        dataToSend = {
          code: 500,
          message: output,
        };
      }
    });

    // Script finished
    python.on('close', (code) => {
      console.log(`Python script run with exit code ${code}`);

      // Send data in response
      if (code === 0) {
        const responseMsg = JSON.stringify(dataToSend);
        console.log(`Response message: ${responseMsg}`);
        res.status(dataToSend.code);
        res.send(responseMsg);
        displayStatus.setSuccess('Image displayed successfully.');

        const { minToDisplay } = req.body;
        if (minToDisplay) {
          handleMinToDisplayWait(req, res, minToDisplay);
        }
      } else {
        res.status(500);
        if (!dataToSend.message) {
          dataToSend.message = 'Unknown error from script.';
        }
        res.send(JSON.stringify(dataToSend));
        displayStatus.setError(`Unknown error code ${code}`);
      }
      removeFile(imageName);
    });
  } else {
    displayIsBusy(res);
  }
});

function removeFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) throw err;
  });
}

// Send message to show on display
app.post('/api/sendmessage', (req, res) => {
  displayStatus.isWaiting = false; // Override waiting flag if command is sent via api
  console.log(`${getCurrentDateTime()} /sendmessage`);
  res.setHeader('content-type', 'application/json');
  if (!displayStatus.isProcessing) {
    if (req.body.minToDisplay) {
      displayStatus.isWaiting = true;
      dispatchStatusUpdateEvent();
    }
    let dataToSend = {};
    console.log('Request body: ', req.body);
    if (req.body.message) {
      const msg = req.body.message.replace(/"/g, '\\"');
      console.log(`Sending message to script: ${msg}`);
      displayStatus.setSuccess(`Received message: ${msg}`);
      // Pass message to python script
      const python = spawn('python', ['../python/printmessage.py', msg]);

      // Output from script
      python.stdout.on('data', function (data) {
        const output = data.toString();
        try {
          dataToSend = JSON.parse(output);
        } catch (e) {
          dataToSend = {
            code: 500,
            message: output,
          };
        }
      });

      // Script finished
      python.on('close', (code) => {
        console.log(`Python script run with exit code ${code}`);

        // Send data in response
        if (code === 0) {
          const responseMsg = JSON.stringify(dataToSend);
          console.log(`Response message: ${responseMsg}`);
          res.status(dataToSend.code);
          res.send(responseMsg);
          displayStatus.setSuccess('Message displayed successfully.');
        } else {
          res.status(500);
          if (!dataToSend.message) {
            dataToSend.message = 'Unknown error from script.';
          }
          res.send(JSON.stringify(dataToSend));
          displayStatus.setError(`Unknown error code ${code}`);
        }

        const { minToDisplay } = req.body;
        if (minToDisplay) {
          handleMinToDisplayWait(req, res, minToDisplay);
        }
      });
    } else {
      const errorMsg = 'No message sent in request body.';
      res.status(400);
      res.send(
        JSON.stringify({
          code: 400,
          message: errorMsg,
        })
      );
      displayStatus.setError(errorMsg);
    }
  } else {
    displayIsBusy(res);
  }
});

function handleMinToDisplayWait(req, res, min) {
  displayStatus.isWaiting = true;

  // Refresh display after designated time
  const minToDisplay = parseInt(min);
  const msToDisplay = minToDisplay * 60000;
  console.log(`Waiting ${msToDisplay}ms`);
  if (msToDisplay > 0) {
    setTimeout(() => {
      if (displayStatus.isWaiting) {
        displayStatus.isWaiting = false;
        dispatchStatusUpdateEvent();
        if (!displayStatus.isProcessing) {
          console.log('Triggering screen refresh after displaying message...');
          triggerMainScript(req, res, false, displayStatus);
          displayStatus.isWaiting = false;
        }
      }
    }, msToDisplay);
  }
}

// Refresh data on display
app.post('/api/refresh/all', (req, res) => {
  displayStatus.isWaiting = false;
  dispatchStatusUpdateEvent();
  triggerMainScript(req, res, true, displayStatus);
});

// Clear display
app.post('/api/refresh/clear', (req, res) => {
  displayStatus.isWaiting = false;
  dispatchStatusUpdateEvent();
  console.log(`${getCurrentDateTime()} /refresh/clear`);
  runRefreshScript('../python/clear_display.py', res, 'Display cleared successfully.', displayStatus);
});

// Reboot system
app.post('/api/reboot', (req, res) => {
  displayStatus.isWaiting = false;
  displayStatus.setSuccess('Initiating system reboot... BRB!');
  dispatchStatusUpdateEvent();
  exec('sudo reboot');
});

// This displays message that the server running and listening to specified port
const server = app.listen(port, () => console.log(`${getCurrentDateTime()}: Listening on port ${port}`));

app.use(express.static(path.join(__dirname, '/build')));

// Web socket to live tail main python log
app.ws('/api/logs/python/active', (ws, req) => {
  console.log(`${getCurrentDateTime()}: Logs WebSocket was opened`);

  watchForLogChanges(ws);

  // Not expecting any client messages, but lets log 'em just in case
  ws.on('message', (msg) => {
    console.log(`Message from logs client: ${msg}`);
  });

  ws.on('close', () => {
    console.log(`${getCurrentDateTime()}: Logs WebSocket was closed`);
  });
});

// Get current display status
app.get('/api/display-status', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.status(200);
  res.send(JSON.stringify(displayStatus));
});

// Web socket for live status updates
app.ws('/api/display-status', (ws, req) => {
  function sendStatusToClient() {
    ws.send(JSON.stringify(displayStatus));
  }
  console.log(`${getCurrentDateTime()}: Status WebSocket was opened`);

  // Send current status on first connect
  sendStatusToClient();

  // Send status on status update events
  emitter.on(displayStatus.UPDATE_EVENT, sendStatusToClient);

  // Not expecting any client messages, but lets log 'em just in case
  ws.on('message', (msg) => {
    console.log(`Message from status client: ${msg}`);
  });

  // Remove status update event listener when connection is closed
  ws.on('close', () => {
    console.log(`${getCurrentDateTime()}: Status WebSocket was closed`);
    emitter.off(displayStatus.UPDATE_EVENT, sendStatusToClient);
  });
});

// All other /api routes
app.get(/^\/api(\/|$)/, (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.status(404);
  res.send(
    JSON.stringify({
      code: 404,
      message: 'No api route found.',
    })
  );
});

// Serve web app on all other paths
app.get('/*', (req, res) => {
  serveReactApp(res);
});

function serveReactApp(res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}
