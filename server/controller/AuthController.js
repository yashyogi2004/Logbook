import { Router } from 'express';
import UserModel from '../db/models/Users.js';
import LogModel from '../db/models/Logs.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';
import generateAuthToken from '../util/Authtoken.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import sendEmail from '../util/otpmessage.js';

dotenv.config();
const router = Router();

// --- 1. GOOGLE OAUTH ROUTES ---

// Trigger Google Login
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google Callback
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
    async (req, res) => {
        try {
            const user = req.user;
            const token = generateAuthToken(user);

            const isProd = process.env.NODE_ENV === "production";

            res.cookie("token", token, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "None" : "Lax",
                maxAge: 24 * 60 * 60 * 1000,
                path: "/",
            });

            res.redirect(`${process.env.CLIENT_URL}/dashboard`);
        } catch (error) {
            console.error("Google Auth Error:", error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        }
    }
);

// --- 2. STANDARD AUTH ROUTES ---

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await UserModel.findOne({
            $or: [{ username }, { email }]
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new UserModel({ username, password, email });
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

        if (!user.password) {
            return res.status(401).json({ message: 'Please login with Google' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateAuthToken(user);

        const isProd = process.env.NODE_ENV === "production";

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });

        res.status(200).json({
            message: 'Login successful',
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

router.get('/logout', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (user) {
            user.isActive = false;
            await user.save();
        }
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 3. OTP & PASSWORD RESET ---

router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        } else {
            const otp = Math.floor(Math.random() * 1000000);
            user.otp = otp;
            user.otpExpiration = new Date(Date.now() + 15 * 60 * 1000);
            await user.save();
            await sendEmail(email, otp);
            res.status(200).json({ message: 'OTP sent successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verifyOTP', async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.otp != otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (user.otpExpiration < new Date()) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        res.status(200).json({ message: 'OTP verification successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/resendOTP', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const otp = Math.floor(Math.random() * 1000000);
        user.otp = otp;
        user.otpExpiration = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        await sendEmail(email, otp);
        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/resetPassword', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 4. USER DATA & PROFILE ---

router.get('/userProfile', isAuthenticated, async (req, res) => {
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

router.get('/currentuser', isAuthenticated, async (req, res) => {
    try {
        res.status(200).json({ username: req.user.username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// View Other User Profile
router.get('/users/:id', isAuthenticated, async (req, res) => {
    const userId = req.params.id;
    const loggedInUserId = req.user.id;

    try {
        const loggedInUser = await UserModel.findById(loggedInUserId);

        if (userId === loggedInUserId) {
            const myself = await UserModel.findById(userId).select('-password').populate('Logs');
            return res.status(200).json(myself);
        }

        const isFollowing = loggedInUser.following.some(id => id.toString() === userId);

        if (!isFollowing) {
            return res.status(403).json({ message: 'You must follow this user to view their full profile.' });
        }

        const user = await UserModel.findById(userId).select('-password').populate('Logs');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get All Users
router.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');
        const userList = users.filter(user => user._id.toString() !== req.user.id);
        res.status(200).json(userList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 5. SOCIAL FEATURES ---

router.post('/follow/:id', isAuthenticated, async (req, res) => {
    const followUserId = req.params.id;
    const loggedInUserId = req.user.id;
    try {
        if (followUserId === loggedInUserId) {
            return res.status(400).json({ message: 'You cannot follow yourself' });
        }
        const loggedInUser = await UserModel.findById(loggedInUserId);
        const followUser = await UserModel.findById(followUserId);

        if (!loggedInUser || !followUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (loggedInUser.following.includes(followUserId)) {
            return res.status(400).json({ message: 'You are already following this user' });
        }

        loggedInUser.following.push(followUserId);
        followUser.followers.push(loggedInUserId);

        await followUser.save();
        await loggedInUser.save();
        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/unfollow/:id', isAuthenticated, async (req, res) => {
    const unfollowUserId = req.params.id;
    const loggedInUserId = req.user.id;
    try {
        if (unfollowUserId === loggedInUserId) {
            return res.status(400).json({ message: 'You cannot unfollow yourself' });
        }
        const loggedInUser = await UserModel.findById(loggedInUserId);
        const unfollowUser = await UserModel.findById(unfollowUserId);

        if (!loggedInUser || !unfollowUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!loggedInUser.following.includes(unfollowUserId)) {
            return res.status(400).json({ message: 'You are not following this user' });
        }

        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== unfollowUserId);
        unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== loggedInUserId);

        await unfollowUser.save();
        await loggedInUser.save();
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/followers', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('followers', 'username email');
        res.status(200).json(user.followers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/following', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate('following', 'username email');
        res.status(200).json(user.following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;