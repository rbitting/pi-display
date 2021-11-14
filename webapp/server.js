const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(bodyParser.json());

app.post('/sendmessage', (req, res) => {
    let dataToSend;
    console.log('Request body: ', req.body);
    res.setHeader('content-type', 'application/json');
    if (req.body.message) {
        const python = spawn('python', ['../modules/printmessage.py', req.body.message.replace(/"/g,"\\\"")]);  // Escape quotes
    
        // Output from script
        python.stdout.on('data', function (data) {
            dataToSend = JSON.parse(data.toString());
        });
    
        // Script finished
        python.on('close', (code) => {
            console.log(`Python script run with exit code ${code}`);
            responseMsg = JSON.stringify(dataToSend);
            console.log(`Response message: ${responseMsg}`);

            // Send data in response
            res.status(dataToSend.code);
            res.send(responseMsg);
        });
    }
    else {
        res.status(400);
        res.send(JSON.stringify({
            'code': 400,
            'message': 'No message sent in request body.'
        }))
    }
});

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(path.join(__dirname, '/build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
