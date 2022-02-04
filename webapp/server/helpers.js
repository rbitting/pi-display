const { spawn } = require('child_process');
const { displayIsBusy } = require('./status');

function runRefreshScript(scriptPath, res, successMsg, displayStatus) {
    displayStatus.isWaiting = false; // Override waiting flag if command is sent via api
    if (!displayStatus.isProcessing) {
        displayStatus.setSuccess(`Running ${scriptPath} refresh.`);
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
                displayStatus.setSuccess(successMsg);
            } else {
                response.code = 500;
                if (code === 1) {
                    response.message = 'Could not get data. Missing API Key.';
                } else {
                    response.message = `Script exited with exit code ${code}.`;
                }
                displayStatus.setError(response.message);
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

function triggerMainScript(req, res, doRespond, displayStatus) {
    displayStatus.isWaiting = false; // Override waiting flag if command is sent via api
    console.log(`${new Date().toLocaleString('en-US')} Refresh display`);
    if (!displayStatus.isProcessing) {
        displayStatus.setSuccess('Starting display refresh...');
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
                    displayStatus.setSuccess(response.message);
                } else {
                    response.code = 500;
                    response.message = `Script exited with exit code ${code}.`;
                    displayStatus.setError(response.message);
                    const responseMsg = JSON.stringify(response);
                    console.log(`Response message: ${responseMsg}`);

                    // Send data in response
                    res.status(500);
                    res.send(responseMsg);
                }
            } else if (code === 0) {
                const status = 'Refresh complete.';
                console.log(status);
                displayStatus.setSuccess(status);
            } else {
                const status = `Script exited with exit code ${code}.`;
                displayStatus.setError(status);
            }
        });
    } else {
        displayIsBusy(res);
    }
}

module.exports = { runRefreshScript, triggerMainScript };
