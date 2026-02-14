const http = require('http');

function request(method, path, data, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 4000,
            path: '/api/' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? 'Bearer ' + token : ''
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function run() {
    try {
        console.log('--- 1. Register Admin ---');
        const email = 'admin_' + Date.now() + '@test.com';
        const auth = await request('POST', 'auth/register', {
            name: 'Test Admin',
            email: email,
            password: 'password',
            role: 'admin'
        });
        console.log('Registered:', auth.user ? 'OK' : JSON.stringify(auth));
        const token = auth.token;

        console.log('\n--- 2. Add Plant ---');
        const plantData = {
            name: 'Verification Plant ' + Date.now(),
            category: 'Indoor Plant',
            price: 150,
            description: 'Test Description',
            image: '/assets/test.jpg'
        };
        const plant = await request('POST', 'admin/plants', plantData, token);
        console.log('Added Plant:', plant.name ? 'OK' : JSON.stringify(plant));

        console.log('\n--- 3. Fetch Public List ---');
        const list = await request('GET', 'plants');
        console.log('List Length:', list.length);

        // Check if our plant is in the list
        const found = list.find(p => p.name === plantData.name);
        console.log('Found New Plant in List:', found ? 'YES' : 'NO');
        if (found) {
            console.log('Category matches?', found.category === 'Indoor Plant');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
