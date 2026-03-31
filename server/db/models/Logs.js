import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attachment: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['Pending', 'inComplete', 'Completed'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    default: Date.now
  },
  coins: {
    type: Number,
    default: 0
  },
  got100Badge: {
    type: Boolean,
    default: false
  },
  got1000Badge: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const LogModel = mongoose.model('Log', LogSchema);
export default LogModel;