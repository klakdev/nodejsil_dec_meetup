
require('./patch');

const express = require('express');
const { exec } = require('child_process');
const app = express();
const NOT_ALLOWED_CHARACTERS = /[^a-z/.:\s]/gmi;

app.use('/vulnerable', (req, res) => {
    const { url } = req.query;
    const cp = exec('curl '.concat(url));
    cp.stdout.pipe(res);
});

app.use('/safe', (req, res) => {
    const { url } = req.query;
    const sanitized = url.replace(NOT_ALLOWED_CHARACTERS, '');
    const cp = exec('curl '.concat(sanitized));
    cp.stdout.pipe(res);
});

app.listen(3000);
