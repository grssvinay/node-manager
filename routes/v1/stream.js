const express = require('express');
var os = require('os');
const { spawn } = require("child_process");

const router = express.Router();

router.use((req, res, next) => {
    console.log("INITIALIZING RESPONSE STREAM");
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    next();
});

router.get('/start', (req, res) => {
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

router.get('/status', (req, res) => {
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

router.get('/stop', (req, res) => {
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

router.get('/install', (req, res) => {
    console.log('BEGIN INSTALLATION');
    const cmd = spawn(`./${os.platform()}/install.sh`);
    
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

router.get('/catchup', (req, res) => {
    console.log('BEGIN CATCHUP');
    // console.log("query params: ", req.query)
    const cmd = spawn(`./${os.platform()}/catchup.sh`, ['-l']);
    
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

module.exports = router;