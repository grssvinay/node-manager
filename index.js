const express = require('express');
const app = express();

var os = require('os');
const { spawn } = require("child_process");

const { HTTP_STATUS_CODES, DEFAULT_PORT, HTTP_STATUS_MESSAGES }  = require('./utils/constants');

const streamRoutes = require('./routes/v1/stream');
app.use("/api/v1/stream", streamRoutes);

var processArgs = require('minimist')(process.argv.slice(2));
const PORT = processArgs['p'] || DEFAULT_PORT

app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
        const fileName = `${__dirname}/${os.platform()}/install.sh`;
        const cmd = spawn("chmod", ["u+x", fileName]);

        cmd.on('error', (error) => console.log(`error: ${error.message}`));
        cmd.on("close", code => console.log(code == 0 ? `File ${fileName} access updated to executable successfully` : `child process closed with code ${code}`));
        cmd.stderr.on("data", data => console.log(data));
        cmd.stdout.on("data", data => console.log(data));
    } else {
        console.log("Error occurred, server can't start", error);
    }
});

app.get('/ping', (_, res) => res.status(HTTP_STATUS_CODES.OK).send(HTTP_STATUS_MESSAGES.OK));