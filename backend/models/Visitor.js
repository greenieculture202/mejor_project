const mongoose = require('mongoose');

const VisitorSchema = new mongoose.Schema({
    email: { type: String, default: 'Guest' },
    name: { type: String, default: 'Anonymous' },
    ip: { type: String },
    userAgent: { type: String },
    lastVisit: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', VisitorSchema);
