const ws = require('ws');
const fs = require('fs');
const { exec } = require('child_process');
const Diff = require('diff');
const path = require('path');
const wsServer = new ws.Server({ noServer: true });

const pythonLogPath = path.join(process.env.HOME, '/logs/main.log');
console.log(`Watching Python log: ${pythonLogPath}`);

const getCurrent = (filepath) =>
    fs.readFileSync(filepath, { encoding: 'utf8' });

let currFile = getCurrent(pythonLogPath);

function watchForLogChanges(server) {
    server.on('upgrade', (request, socket, head) => {
        const pathname = request.url;
        console.log(`pathname: ${pathname}`);
        if (pathname === '/logs/python/active') {
            wsServer.handleUpgrade(request, socket, head, (socket) => {
                wsServer.emit('connection', socket, request);

                fs.watchFile(
                    pythonLogPath,
                    { encoding: 'buffer' },
                    (eventType, filename) => {
                        const newFile = getCurrent(pythonLogPath);
                        const difference = Diff.diffWordsWithSpace(
                            currFile,
                            newFile
                        );
                        console.log(difference);
                        if (difference.length > 1 && difference[1].added) {
                            console.log(difference[1].value);
                            socket.send(difference[1].value);
                        }
                        currFile = newFile;
                    }
                );
            });
        }
    });
}

function sendLog(res) {
    console.log('Sending log message to client...');
    exec(`tail -n 20 ${pythonLogPath}`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            res.send(JSON.stringify({ 'error': error, 'message': stderr, 'code': 500 }));
            return;
        }
        console.log(stdout);
        res.send(JSON.stringify({ 'code': 200, 'message': stdout }));
    });
};

module.exports = { watchForLogChanges, sendLog };
