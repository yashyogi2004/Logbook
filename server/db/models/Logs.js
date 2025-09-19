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
    attachment:{
        type: String,
        contentType: Buffer
    },
    status:{
        type: String,
        enum: ['Pending', 'InComplete', 'Completed'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

//TTL index to auto-delete logs after 30 days
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
const Log = mongoose.model('Log', LogSchema);
module.exports = Log;