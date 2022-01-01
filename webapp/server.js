const { runRefreshScript, triggerMainScript } = require('./server/helpers');
const { displayIsBusy, DisplayStatus } = require('./server/status');
const { sendLog, watchForLogChanges } = require('./server/watch-logs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { spawn } = require('child_process');
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
    }
});
const upload = multer({ storage: storage });
const fs = require('fs');
const displayStatus = new DisplayStatus();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
app.use(bodyParser.json());

app.get('/display-status', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200);
    res.send(JSON.stringify(displayStatus));
});

app.post('/display-status', (req, res) => {
    console.log('Request body: ', req.body);
    res.setHeader('content-type', 'application/json');
    if (req.body) {
        displayStatus.lastRefresh = new Date().toLocaleString('en-US');
        displayStatus.message = req.body.message || '';
        displayStatus.isError = req.body.isError;
        displayStatus.isProcessing = req.body.isProcessing;
        res.status(200);
        res.send(JSON.stringify(displayStatus));
    } else {
        res.status(400);
        res.send(
            JSON.stringify({
                code: 400,
                message: 'No message sent in request body.'
            })
        );
    }
});

app.get('/logs/python', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(200);
    sendLog(res);
});

app.post('/send-image', upload.single('file'), (req, res) => {
    if (!req.file) {
        const errorMsg = 'No image received.';
        res.status(500);
        res.send({
            code: 500,
            message: errorMsg
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
                    message: output
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

                const minToDisplay = req.body.minToDisplay;
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
        console.log('path/file.txt was deleted');
    });
}

app.post('/sendmessage', (req, res) => {
    displayStatus.isWaiting = false; // Override waiting flag if command is sent via api
    console.log(`${new Date().toLocaleString('en-US')} /sendmessage`);
    res.setHeader('content-type', 'application/json');
    if (!displayStatus.isProcessing) {
        if (req.body.minToDisplay) {
            displayStatus.isWaiting = true;
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
                        message: output
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

                const minToDisplay = req.body.minToDisplay;
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
                    message: errorMsg
                })
            );
            displayStatus.setError(errorMsg);
        }
    } else {
        displayIsBusy(res);
    }
});

function handleMinToDisplayWait(req, res, min) {
    // Refresh display after designated time
    const minToDisplay = parseInt(min);
    const msToDisplay = minToDisplay * 60000;
    console.log(`Waiting ${msToDisplay}ms`);
    if (msToDisplay > 0) {
        setTimeout(() => {
            if (displayStatus.isWaiting) {
                displayStatus.isWaiting = false;
                if (!displayStatus.isProcessing) {
                    console.log(
                        'Triggering screen refresh after displaying message...'
                    );
                    triggerMainScript(req, res, false, displayStatus);
                }
            }
        }, msToDisplay);
    }
}

app.post('/refresh/all', (req, res) => {
    displayStatus.isWaiting = false;
    triggerMainScript(req, res, true, displayStatus);
});

app.post('/refresh/clear', (req, res) => {
    displayStatus.isWaiting = false;
    console.log(`${new Date().toLocaleString('en-US')} /refresh/clear`);
    runRefreshScript(
        '../python/clear_display.py',
        res,
        'Display cleared successfully.',
        displayStatus
    );
});

// This displays message that the server running and listening to specified port
const server = app.listen(port, () =>
    console.log(`${new Date().toLocaleString('en-US')}: Listening on port ${port}`)
);

app.use(express.static(path.join(__dirname, '/build')));

watchForLogChanges(server);

app.get('/log', (req, res) => {
    serveReactApp(res);
});

app.get('/*', (req, res) => {
    serveReactApp(res);
});

function serveReactApp(res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
}
