const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    task_title: {
        type: String,
    },
    task_description: {
        type: String,
    },
    Month:{
        type: String,
        default: new Date().toLocaleString('default', { month: 'long' }) // Default to current month
    },
    status:{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Log = mongoose.model('Log', LogSchema);
module.exports = Log;