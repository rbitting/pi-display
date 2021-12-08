const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const displayStatus = {
    lastRefresh: '',
    isError: false,
    message: ''
};

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
	if (!displayStatus.isProcessing) {
		let dataToSend = {};
		console.log('Request body: ', req.body);
		res.setHeader('content-type', 'application/json');
		if (req.body.message) {
			const msg = req.body.message.replace(/"/g, '\\"');
			console.log(`Sending message to script: ${msg}`);
			const python = spawn('python', ['../python/printmessage.py', msg]); // Escape quotes

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
				} else {
					res.status(500);
					if (!dataToSend.message) {
						dataToSend.message = 'Unknown error from script.';
					}
					res.send(JSON.stringify(dataToSend));
				}
				
				// Refresh display after a minute
				setTimeout(() => {
					if (!displayStatus.isProcessing) {
						triggerMainScript(req, res, false);
					}
				}, 60000);
			});
		} else {
			res.status(400);
			res.send(JSON.stringify({
				'code': 400,
				'message': 'No message sent in request body.'
			}));
		}
	}
	else {
		res.status(409);
		res.send(JSON.stringify({
			'code': 409,
			'message': 'Server is busy. Please try again in a few minutes.'
		}));
	}
});

app.post('/refresh/all', (req, res) => {
    triggerMainScript(req, res, true);
});

app.post('/refresh/clear', (req, res) => {
    runRefreshScript('../python/clear_display.py', res, 'Display cleared successfully.');
});

function triggerMainScript(req, res, doRespond) {
	const python = spawn('python3', ['../python/main.py']);

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
			} else {
				response.code = 500;
				if (code === 1) {
					response.message = 'Could not get data. Missing API Key.';
				} else {
					response.message = `Script exited with exit code ${code}.`;
				}
				const responseMsg = JSON.stringify(response);
				console.log(`Response message: ${responseMsg}`);
				
				// Send data in response
				res.status(500);
				res.send(responseMsg);
			}
		}
		else {
			console.log('Refresh complete.');
		}
    });
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
app.listen(port, () => console.log(`Listening on port ${port}`));

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
        } else {
            response.code = 500;
            if (code === 1) {
                response.message = 'Could not get data. Missing API Key.';
            } else {
                response.message = `Script exited with exit code ${code}.`;
            }
            const responseMsg = JSON.stringify(response);
            console.log(`Response message: ${responseMsg}`);

            // Send data in response
            res.status(500);
            res.send(responseMsg);
        }
    });
}

function serveReactApp(res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
}
