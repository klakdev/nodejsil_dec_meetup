
const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use((req, res) => {
    const { url } = req.query;
    const cp = exec('curl ' + sanitized);
    cp.stdout.pipe(req);
});
