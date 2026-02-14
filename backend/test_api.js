const http = require('http');

const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/auth/status', // Simple GET route (unprotected here but will return JSON)
    method: 'GET'
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();
