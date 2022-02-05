const fs = require('fs');
const { exec } = require('child_process');
const Diff = require('diff');
const path = require('path');

function watchForLogChanges(ws) {
    const pythonLogPath = getLogPath();
    console.log(`Watching Python log: ${pythonLogPath}`);

    try {
        const getCurrent = (filepath) => fs.readFileSync(filepath, { encoding: 'utf8' });
        let currFile = getCurrent(pythonLogPath);
        fs.watchFile(pythonLogPath, { encoding: 'buffer' }, (eventType, filename) => {
            const newFile = getCurrent(pythonLogPath);
            const difference = Diff.diffWordsWithSpace(currFile, newFile);
            console.log(difference);
            if (difference.length > 1 && difference[1].added) {
                console.log(difference[1].value);
                ws.send(difference[1].value);
            }
            currFile = newFile;
        });
    } catch {
        console.error(`Could not open file: ${pythonLogPath}`);
        ws.send(`Could not access file: ${pythonLogPath}`);
    }
}

function sendLog(res) {
    console.log('Sending log message to client...');

    /**
     * If running this code on Windows, make sure to deploy the server
     * in a bash terminal, otherwise 'tail' will not work
     */
    exec(`tail -n 20 ${getLogPath()}`, (error, stdout, stderr) => {
        if (error) {
            console.log(error);
            res.send(JSON.stringify({ error, message: stderr, code: 500 }));
            return;
        }
        res.send(JSON.stringify({ code: 200, message: stdout }));
    });
}

function getLogPath() {
    const today = new Date();
    let month = `${today.getMonth() + 1}`;
    if (month.length === 1) {
        month = `0${month}`;
    }
    let day = `${today.getDate()}`;
    if (day.length === 1) {
        day = `0${day}`;
    }
    const logDate = today.getFullYear() + month + day;
    return path.join(process.env.HOME, `/logs/${logDate}_main.log`);
}

module.exports = { watchForLogChanges, sendLog };
