require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectDB } = require('./utils/db');
const Plant = require('./models/Plant');

const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const cartRoutes = require('./routes/cart');
const adminRoutes = require('./routes/admin');

const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', require('./routes/orders'));
app.use('/api/care-tips', require('./routes/care'));

app.get('/', (req, res) => res.json({ ok: true, message: 'Greenie backend running' }));

connectDB()
  .then(() => {
    server.listen(PORT, async () => {
      console.log(`Server running on http://localhost:${PORT}`);
      try {
        const count = await Plant.countDocuments();
        console.log(`Verified: Database has ${count} plants.`);
      } catch (e) {
        console.error('Error verifying plants:', e);
      }
    });
  })
  .catch((err) => {
    console.error('DB connect error', err);
    process.exit(1);
  });
