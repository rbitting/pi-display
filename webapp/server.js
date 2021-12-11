const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const displayStatus = {
    lastRefresh: new Date().toLocaleString('en-US'),
    isError: false,
    isProcessing: false,
    message: 'Server initiated.'
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

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
        displayStatus.isError = req.body.isError;
        displayStatus.lastRefresh = req.body.lastRefresh || new Date().toLocaleString('en-US');
        displayStatus.message = req.body.message || '';
        res.status(200);
        res.send(JSON.stringify(displayStatus));
    } else {
        res.status(400);
        res.send(JSON.stringify({
            'code': 400,
            'message': 'No message sent in request body.'
        }));
    }
});

app.post('/sendmessage', (req, res) => {
	console.log(`${new Date().toLocaleString('en-US')} /sendmessage`);
    res.setHeader('content-type', 'application/json');
    if (!displayStatus.isProcessing) {
        let dataToSend = {};
        console.log('Request body: ', req.body);
        if (req.body.message) {
            const msg = req.body.message.replace(/"/g, '\\"');
            console.log(`Sending message to script: ${msg}`);
            setIsProcessing(true);
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
                    setSuccess('Refresh script run successfully.');
                } else {
                    res.status(500);
                    if (!dataToSend.message) {
                        dataToSend.message = 'Unknown error from script.';
                    }
                    res.send(JSON.stringify(dataToSend));
                    setError(`Unknown error code ${code}`);
                }
                setIsProcessing(false);

                // Refresh display after a minute
                setTimeout(() => {
                    if (!displayStatus.isProcessing) {
                        triggerMainScript(req, res, false);
                    }
                }, 60000);
            });
        } else {
            const errorMsg = 'No message sent in request body.';
            res.status(400);
            res.send(JSON.stringify({
                'code': 400,
                'message': errorMsg
            }));
            setError(errorMsg);
        }
    } else {
        displayIsBusy(res);
    }
});

app.post('/refresh/all', (req, res) => {
    triggerMainScript(req, res, true);
});

app.post('/refresh/clear', (req, res) => {
	console.log(`${new Date().toLocaleString('en-US')} /refresh/clear`);
    runRefreshScript('../python/clear_display.py', res, 'Display cleared successfully.');
});

function displayIsBusy(res) {
    const errorMsg = 'Display is busy. Please try again in a few minutes.';
	console.log(`${new Date().toLocaleString('en-US')} ${errorMsg}`);
    res.status(409);
    res.send(JSON.stringify({
        'code': 409,
        'message': errorMsg
    }));
}

function triggerMainScript(req, res, doRespond) {
	console.log(`${new Date().toLocaleString('en-US')} Refresh display`);
    if (!displayStatus.isProcessing) {
        setIsProcessing(true);
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
            } else {
                if (code === 0) {
					const status = 'Refresh complete.';
					console.log(status);
					setSuccess(status);
				}
				else {
					const status = `Script exited with exit code ${code}.`;
					setError(status);
				}
					
            }
            setIsProcessing(false);
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
app.listen(port, () => console.log(`${new Date().toLocaleString('en-US')}: Listening on port ${port}`));

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
    if (!displayStatus.isProcessing) {
        setIsProcessing(true);
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
            setIsProcessing(false);
        });
    } else {
        displayIsBusy(res);
    }
}

function serveReactApp(res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
}
