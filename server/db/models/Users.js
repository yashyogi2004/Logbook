import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: false // For OAuth users (like Google login)
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    profilePic: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now 
    },
    Logs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log'
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    isPrivate: {
        type: Boolean,
        default: false 
    },
    otp: {
        type: Number,
        default: null
    },
    otpExpiration: {
        type: Date,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followRequests: [{   
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    requested: [{        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    accountType: { 
        type: String, 
        enum: ['Learner', 'Student', 'Achiever Pro', 'Campus'], 
        default: 'Learner' 
    },
    isStudentVerified: { 
        type: Boolean, 
        default: false 
    },
    trialExpirationDate: { 
        type: Date, 
        default: null 
    },
    bio: {
        type: String,
        default: "Active Learner"
    },
    location: {
        type: String,
        default: "Not specified"
    },
    coins: {            
        type: Number,
        default: 0
    },
    lastDailyCheck: {          
        type: Date,
        default: null
    },
    badges: {
        type: [String],   
        default: []
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.virtual('followerCount').get(function () {
    return Array.isArray(this.followers) ? this.followers.length : 0;
});
userSchema.virtual('followingCount').get(function () {
    return Array.isArray(this.following) ? this.following.length : 0;
});
userSchema.virtual('logsCount').get(function () {
    return Array.isArray(this.Logs) ? this.Logs.length : 0;
});

const User = mongoose.model('User', userSchema);
export default User;