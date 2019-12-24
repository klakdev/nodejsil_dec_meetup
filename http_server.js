
const http = require('http');
const server = http.createServer();
const NOT_ALLOWED_CHARACTERS = /[^a-z/.:\s]/gmi;

server.on(function(req, res) {
    
    let data = '';
    
    req.on('data', chunk => {
        data += chunk;
    });
    
    req.on('end', () => {
        data = url.replace(NOT_ALLOWED_CHARACTERS, '');
    });
    
    req.on('end', () => {
        const cp = exec('curl ' + data);
        cp.stdout.pipe(res);
    });
});

server.listen(3000);
