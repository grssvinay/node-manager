const express = require('express');
var os = require('os');
const { spawn, spawnSync } = require("child_process");

const app = express();
const PORT = 3000;

app.listen(PORT, (error) => {
    if(!error) {
        console.log("Server is Successfully Running, and App is listening on port " + PORT)
        const fileName = `${__dirname}/${os.platform()}/install.sh`;
        const cmd = spawn("chmod", ["u+x", fileName]);

        cmd.on('error', (error) => console.log(`error: ${error.message}`));
        cmd.on("close", code => console.log(code == 0 ? `File ${fileName} access updated to executable successfully` : `child process closed with code ${code}`));
        cmd.stderr.on("data", data => console.log(stderr));
        cmd.stdout.on("data", data => console.log(data));
    } else {
        console.log("Error occurred, server can't start", error);
    }
});

app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

app.get('/access', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    const cmd = spawn("chmod", ["u+x", `${__dirname}/${os.platform()}/install.sh`]);

    cmd.on('error', (error) => {
        console.log(`error: ${error.message}`);
        res.write(error.message)
    });

    cmd.on("close", code => {
        console.log(`child process closed with code ${code}`);
        res.write(`\n\n\nstatus code: ${code}\n***JOB FINISHED***`);
        res.end();
    });

    cmd.stderr.on("data", data => res.write(data));
    cmd.stdout.on("data", data => res.write(data));
});

app.use('/stream', (req, res, next) => {
    console.log("INITIALIZING RESPONSE STREAM");
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    next();
});

app.get('/stream/start', (req, res) => {
    const cmd = spawn(`./${os.platform()}/start.sh`);
    cmd.on('error', (error) => {
        console.log(`error: ${error.message}`);
        res.write(error.message)
    });

    cmd.on("close", code => {
        console.log(code == 0 ? "node started" : `child process closed with code ${code}`);
        res.write("\n\n\n***JOB FINISHED - CLOSE***");
        res.end();
    });

    cmd.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        res.write(data);
    });

    cmd.stdout.on("data", data => res.write(data));
});

app.get('/stream/status', (req, res) => {
    console.log('BEGIN FETCH STATUS')

    const cmd = spawn("pgrep", ["algod"]);

    cmd.on('error', (error) => {
        console.log(`error: ${error.message}`);
        res.write(error.message)
    });

    cmd.on("close", code => {
        res.write("\n\n\n***JOB FINISHED - CLOSE***");
        res.end();
    });

    cmd.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        res.write(data);
    });

    cmd.stdout.on("data", data => res.write(data));
});

app.get('/stream/stop', (req, res) => {
    const cmd = spawn(`./${os.platform()}/stop.sh`);
    
    cmd.on('error', (error) => {
        console.log(`error: ${error.message}`);
        res.write(error.message)
    });

    cmd.on("close", code => {
        console.log(code == 0 ? "node stopped" : `child process closed with code ${code}`);
        res.write("\n\n\n***JOB FINISHED - CLOSE***");
        res.end();
    });

    cmd.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        res.write(data);
    });

    cmd.stdout.on("data", data => res.write(data));
});

app.get('/stream/install', (req, res) => {
    console.log('BEGIN INSTALLATION');
    const cmd = spawn(`./${os.platform()}//install.sh`);

    cmd.on('error', (error) => {
        console.log(`error: ${error.message}`);
        res.write(error.message)
    });

    cmd.on("exit", code => {
        console.log(`child process exited with code ${code}`);
        res.write("\n\n\n***JOB FINISHED - EXIT***");
    });
    
    cmd.on("close", code => {
        console.log(`child process closed with code ${code}`);
        res.write("\n\n\n***JOB FINISHED - CLOSE***");
        res.end();
    });

    cmd.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
        res.write(data);
    });

    cmd.stdout.on("data", data => res.write(data));
})

app.get('/spawn-sync-example', (req, res) => {
    // const cmd = spawnSync("ls", ["-lt"])
    // const resp = {
    //     stdout: new Buffer(cmd.stdout).toString('ascii'),
    //     stderr: cmd.stderr,
    //     error: cmd.error
    // }
    res.send('Hello World!')    
})

app.get('/', (req, res) => res.send('Hello World!'));