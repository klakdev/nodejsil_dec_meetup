
const express = require('express');
const { exec } = require('child_process');
const app = express();
const NOT_ALLOWED_CHARACTERS = /[^a-z/.:\s]/gmi;

app.use((req, res) => {
    const { url } = req.query;
    const sanitized = url.replace(NOT_ALLOWED_CHARACTERS, '');
    const cp = exec('curl ' + sanitized);
    cp.stdout.pipe(res);
});

app.listen(3000);
