const router = require('express').Router();
const UserModel = require('../db/models/Users');
const LogModel = require('../db/models/Logs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const generateAuthToken = require('../util/Authtoken');
const isAuthenticated = require('../controller/AuthController');
dotenv.config();


router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await UserModel.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
    
        const user = new UserModel({
            username,
            password,
            email
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateAuthToken(user);
        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            path: '/'
        });
        res.status(200).json({ message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
         });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/userProfile',isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('Logs');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
         // Exclude password from the response
         const userList = [];
        for(let user of users){
            if(user._id.toString() !== req.user.id){
                userList.push(user);
            }
        }
        res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/currentuser', isAuthenticated, async (req, res) => {
    try {
        const currentUsername = req.user.username;
        res.status(200).json({ username: currentUsername });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/users/:id', isAuthenticated, async (req, res) => {
    const userId = req.params.id;
    const LoggedInUserId = req.user.username;
    try {
        const user = await UserModel.findById(userId).select('-password').populate('Logs'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/logout', isAuthenticated, async(req, res) => {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    user.isActive = false; // Set user as inactive on logout
    await user.save();
    res.clearCookie('token'); // Clear the token cookie
    res.status(200).json({ message: 'Logged out successfully' });
});





module.exports = router;
