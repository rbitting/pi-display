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

const displayStatus = {
    lastRefresh: new Date().toLocaleString('en-US'),
    isError: false,
    isProcessing: false,
    message: 'Server initiated.',
    isWaiting: false
};

function setError(message) {
    setIsError(true);
    setStatusMsg(message);
    setLastRefresh();
}

function setSuccess(message) {
    setIsError(false);
    setStatusMsg(message);
    setLastRefresh();
}

function setLastRefresh() {
    displayStatus.lastRefresh = new Date().toLocaleString('en-US');
}

function setIsError(value) {
    displayStatus.isError = value;
}
function setStatusMsg(message) {
    displayStatus.message = message;
}
function setIsProcessing(value) {
    displayStatus.isProcessing = value;
}
function setIsWaiting(value) {
    displayStatus.isWaiting = value;
}

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
    res.status(200);
    res.send(JSON.stringify(displayStatus));
});

app.post('/display-status', (req, res) => {
    console.log('Request body: ', req.body);
    if (req.body) {
        displayStatus.lastRefresh = new Date().toLocaleString('en-US');
        displayStatus.message = req.body.message || '';
        setIsError(req.body.isError);
        setIsProcessing(req.body.isProcessing);
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
        setSuccess(`Received message: ${imageName}`);
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
                setSuccess('Image displayed successfully.');

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
                setError(`Unknown error code ${code}`);
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
    setIsWaiting(false); // Override waiting flag if command is sent via api
    console.log(`${new Date().toLocaleString('en-US')} /sendmessage`);
    res.setHeader('content-type', 'application/json');
    if (!displayStatus.isProcessing) {
        if (req.body.minToDisplay) {
            setIsWaiting(true);
        }
        let dataToSend = {};
        console.log('Request body: ', req.body);
        if (req.body.message) {
            const msg = req.body.message.replace(/"/g, '\\"');
            console.log(`Sending message to script: ${msg}`);
            setSuccess(`Received message: ${msg}`);
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
                    setSuccess('Message displayed successfully.');
                } else {
                    res.status(500);
                    if (!dataToSend.message) {
                        dataToSend.message = 'Unknown error from script.';
                    }
                    res.send(JSON.stringify(dataToSend));
                    setError(`Unknown error code ${code}`);
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
            setError(errorMsg);
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
                setIsWaiting(false);
                if (!displayStatus.isProcessing) {
                    console.log(
                        'Triggering screen refresh after displaying message...'
                    );
                    triggerMainScript(req, res, false);
                }
            }
        }, msToDisplay);
    }
}

app.post('/refresh/all', (req, res) => {
    setIsWaiting(false);
    triggerMainScript(req, res, true);
});

app.post('/refresh/clear', (req, res) => {
    setIsWaiting(false);
    console.log(`${new Date().toLocaleString('en-US')} /refresh/clear`);
    runRefreshScript(
        '../python/clear_display.py',
        res,
        'Display cleared successfully.'
    );
});

function displayIsBusy(res) {
    const errorMsg = 'Display is busy. Please try again in a few minutes.';
    console.log(`${new Date().toLocaleString('en-US')} ${errorMsg}`);
    res.status(409);
    res.send(
        JSON.stringify({
            code: 409,
            message: errorMsg
        })
    );
}

function triggerMainScript(req, res, doRespond) {
    setIsWaiting(false); // Override waiting flag if command is sent via api
    console.log(`${new Date().toLocaleString('en-US')} Refresh display`);
    if (!displayStatus.isProcessing) {
        setSuccess('Starting display refresh...');
        const python = spawn('python', ['../python/main.py']);

        // Output from script
        python.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        // Script finished
        python.on('close', (code) => {
            console.log(`Display refresh script run with exit code ${code}`);
            if (doRespond) {
                res.setHeader('content-type', 'application/json');

                const response = {
                    code: 200,
                    message: 'Display refreshed successfully.'
                };
                if (code === 0) {
                    const responseMsg = JSON.stringify(response);
                    console.log(`Response message: ${responseMsg}`);

                    // Send data in response
                    res.status(response.code);
                    res.send(responseMsg);
                    setSuccess(response.message);
                } else {
                    response.code = 500;
                    if (code === 1) {
                        response.message =
                            'Could not get data. Missing API Key.';
                    } else {
                        response.message = `Script exited with exit code ${code}.`;
                    }
                    setError(response.message);
                    const responseMsg = JSON.stringify(response);
                    console.log(`Response message: ${responseMsg}`);

                    // Send data in response
                    res.status(500);
                    res.send(responseMsg);
                }
            } else {
                if (code === 0) {
                    const status = 'Refresh complete.';
                    console.log(status);
                    setSuccess(status);
                } else {
                    const status = `Script exited with exit code ${code}.`;
                    setError(status);
                }
            }
        });
    } else {
        displayIsBusy(res);
    }
}

/* app.post('/refresh/crypto', (req, res) => {
    runRefreshScript('../python/refresh_crypto.py', res, 'Crypto refreshed successfully.');
});

app.post('/refresh/network', (req, res) => {
    runRefreshScript('../python/refresh_network.py', res, 'Network refreshed successfully.');
});

app.post('/refresh/news', (req, res) => {
    runRefreshScript('../python/refresh_news.py', res, 'News refreshed successfully.');
});

app.post('/refresh/pihole', (req, res) => {
    runRefreshScript('../python/refresh_pihole.py', res, 'Pi-Hole refreshed successfully.');
});

app.post('/refresh/septa', (req, res) => {
    runRefreshScript('../python/refresh_septa.py', res, 'Septa refreshed successfully.');
});

app.post('/refresh/weather', (req, res) => {
    runRefreshScript('../python/refresh_weather.py', res, 'Weather refreshed successfully.');
}); */

// This displays message that the server running and listening to specified port
app.listen(port, () =>
    console.log(
        `${new Date().toLocaleString('en-US')}: Listening on port ${port}`
    )
);

app.use(express.static(path.join(__dirname, '/build')));

app.get('/', (req, res) => {
    serveReactApp(res);
});

app.get('/log', (req, res) => {
    serveReactApp(res);
});

app.get('/*', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.status(404);
    res.send({ code: 404, message: 'Path not found.' });
});

function runRefreshScript(scriptPath, res, successMsg) {
    setIsWaiting(false); // Override waiting flag if command is sent via api
    if (!displayStatus.isProcessing) {
        setSuccess(`Running ${scriptPath} refresh.`);
        const python = spawn('python', [scriptPath]);

        res.setHeader('content-type', 'application/json');

        // Output from script
        python.stdout.on('data', function (data) {
            console.log(data.toString());
        });

        // Script finished
        python.on('close', (code) => {
            const response = {
                code: 200,
                message: successMsg
            };
            console.log(`Python script run with exit code ${code}`);
            if (code === 0) {
                const responseMsg = JSON.stringify(response);
                console.log(`Response message: ${responseMsg}`);

                // Send data in response
                res.status(200);
                res.send(responseMsg);
                setSuccess(successMsg);
            } else {
                response.code = 500;
                if (code === 1) {
                    response.message = 'Could not get data. Missing API Key.';
                } else {
                    response.message = `Script exited with exit code ${code}.`;
                }
                setError(response.message);
                const responseMsg = JSON.stringify(response);
                console.log(`Response message: ${responseMsg}`);

                // Send data in response
                res.status(500);
                res.send(responseMsg);
            }
        });
    } else {
        displayIsBusy(res);
    }
}

function serveReactApp(res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
}
