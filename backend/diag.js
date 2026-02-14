const mongoose = require('mongoose');
const User = require('./models/User');
const Visitor = require('./models/Visitor');

async function check() {
    try {
        await mongoose.connect('mongodb://localhost:27017/greenie', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to DB');

        const users = await User.find().lean();
        console.log('--- ALL USERS IN DB (' + users.length + ') ---');
        for (let i = 0; i < users.length; i++) {
            const u = users[i];
            console.log(`${i + 1}. [${u.role}] ${u.name} <${u.email}> Blocked: ${u.isBlocked}`);
        }

        const visitors = await Visitor.find().lean();
        console.log('--- VISITORS IN DB (' + visitors.length + ') ---');
        visitors.forEach(v => {
            console.log(`- ${v.name} <${v.email}> IP: ${v.ip}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
