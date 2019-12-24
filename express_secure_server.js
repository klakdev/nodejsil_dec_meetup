
const express = require('express');
const { exec } = require('child_process');
const app = express();
const NOT_ALLOWED_CHARECTERES = /[^a-z/.:\s]/gmi;

app.use((req, res) => {
    const { url } = req.query;
    const sanitized = url.replace(NOT_ALLOWED_CHARECTERES, '');
    const cp = exec('curl ' + sanitized);
    cp.stdout.pipe(req);
});

app.listen(3000);
