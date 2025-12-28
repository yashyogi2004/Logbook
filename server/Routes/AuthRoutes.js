import crypto from "crypto";
import { Router } from 'express';
import UserModel from '../db/models/Users.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import passport from 'passport';
import generateAuthToken from '../util/Authtoken.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import sendEmail from '../util/otpmessage.js';
import nodemailer from "nodemailer";
import mongoose from "mongoose";

const router = Router();
dotenv.config();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

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
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.password) return res.status(401).json({ message: 'Please login with Google' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

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
            user: { id: user._id, username: user.username, email: user.email, profilePic: user.profilePic }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- PREMIUM & MEMBERSHIP ROUTES ---

router.post('/activate-trial', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        const expiration = new Date();
        expiration.setFullYear(expiration.getFullYear() + 1);

        user.accountType = 'Achiever Pro';
        user.trialExpirationDate = expiration;
        await user.save();

        res.status(200).json({ success: true, message: "1-Year Pro Trial activated!" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/verify-student', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.accountType = 'Student';
        user.isStudentVerified = true;
        user.trialExpirationDate = null;

        await user.save();
        res.status(200).json({ success: true, message: "Student status verified successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to verify student status' });
    }
});

// --- PROFILE & SOCIAL ROUTES ---
router.get('/userProfile', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({
            id: user._id,
            username: user.username || "",
            email: user.email || "",
            profilePic: user.profilePic || "",
            accountType: user.accountType || "",
            isStudentVerified: !!user.isStudentVerified,
            trialExpirationDate: user.trialExpirationDate || null,
            bio: user.bio ?? "",
            location: user.location ?? "",
            followers: user.followers,
            following: user.following,
            requested: user.requested || [],
            followRequests: user.followRequests || [],
            coins: user.coins || 0,
            badges: user.badges || []
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/updateProfile', isAuthenticated, async (req, res) => {
    try {
        const { username, bio, location, isPrivate } = req.body;
        const user = await UserModel.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (username !== undefined) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (isPrivate !== undefined) user.isPrivate = isPrivate;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
});

// Send a follow request
router.post('/request-follow/:id', isAuthenticated, async (req, res) => {
    const targetId = req.params.id;
    const userId = req.user.id;
    if (targetId === userId) return res.status(400).json({ message: "Can't follow yourself!" });

    const target = await UserModel.findById(targetId);
    const me = await UserModel.findById(userId);

    if (!target || !me) return res.status(404).json({ message: 'User not found' });
    if (me.following.includes(targetId) || target.followers.includes(userId))
        return res.status(400).json({ message: "Already following each other." });

    if (!target.followRequests.includes(userId)) target.followRequests.push(userId);
    if (!me.requested.includes(targetId)) me.requested.push(targetId);

    await target.save();
    await me.save();
    res.json({ message: "Follow request sent" });
});

// Accept a follow request
router.post('/accept-follow/:id', isAuthenticated, async (req, res) => {
    const requesterId = req.params.id;
    const userId = req.user.id;
    const me = await UserModel.findById(userId);
    const requester = await UserModel.findById(requesterId);

    if (!me || !requester) return res.status(404).json({ message: 'User not found' });

    // Remove request
    me.followRequests = me.followRequests.filter(id => id.toString() !== requesterId);
    requester.requested = requester.requested.filter(id => id.toString() !== userId);
    // Now follow each other
    if (!me.followers.includes(requesterId)) me.followers.push(requesterId);
    if (!requester.following.includes(userId)) requester.following.push(userId);

    await me.save();
    await requester.save();
    res.json({ message: "Follow request accepted" });
});

// Cancel your sent request
router.post('/cancel-follow-request/:id', isAuthenticated, async (req, res) => {
    const targetId = req.params.id;
    const userId = req.user.id;
    const target = await UserModel.findById(targetId);
    const me = await UserModel.findById(userId);

    if (!target || !me) return res.status(404).json({ message: 'User not found' });

    target.followRequests = target.followRequests.filter(id => id.toString() !== userId);
    me.requested = me.requested.filter(id => id.toString() !== targetId);

    await target.save();
    await me.save();
    res.json({ message: "Request cancelled." });
});

// Decline (reject) a receive request
router.post('/decline-follow-request/:id', isAuthenticated, async (req, res) => {
    const requesterId = req.params.id;
    const userId = req.user.id;
    const me = await UserModel.findById(userId);
    const requester = await UserModel.findById(requesterId);

    if (!me || !requester) return res.status(404).json({ message: 'User not found' });

    me.followRequests = me.followRequests.filter(id => id.toString() !== requesterId);
    requester.requested = requester.requested.filter(id => id.toString() !== userId);

    await me.save();
    await requester.save();
    res.json({ message: "Request declined." });
});

// List all users except the current user (for explore/follow)
router.get('/users', isAuthenticated, async (req, res) => {
    try {
        const users = await UserModel.find({ _id: { $ne: req.user.id } })
            .select('username email profilePic accountType location bio followers following')
            .lean();
        // Add follower/following counts
        const usersWithStats = users.map(user => ({
            ...user,
            followersCount: user.followers.length || 0,
            followingCount: user.following.length || 0
        }));
        res.status(200).json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/users/:id', isAuthenticated, async (req, res) => {
    const userId = req.params.id;
    const loggedInUserId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID.' });
    }

    try {
        const user = await UserModel.findById(userId)
            .select('-password')
            .populate('followers', 'username profilePic')
            .populate('following', 'username profilePic')
            .lean();

        if (!user) return res.status(404).json({ message: 'User not found.' });

        const isSelf = userId === loggedInUserId;
        const isFollowing = user.followers?.some(
            f => (f._id?.toString() || f.toString()) === loggedInUserId
        );

        const basicInfo = {
            _id: user._id,
            username: user.username,
            profilePic: user.profilePic,
            accountType: user.accountType,
            bio: user.bio,
            location: user.location,
            isPrivate: user.isPrivate,
            followerCount: Array.isArray(user.followers) ? user.followers.length : 0,
            followingCount: Array.isArray(user.following) ? user.following.length : 0,
        };

        if (isSelf || isFollowing) {
            const fullUser = await UserModel.findById(userId)
                .select('-password')
                .populate('Logs')
                .populate('followers', 'username profilePic')
                .populate('following', 'username profilePic')
                .lean();

            return res.status(200).json({
                ...basicInfo,
                logs: Array.isArray(fullUser.Logs) ? fullUser.Logs : [],
                followers: fullUser.followers,
                following: fullUser.following,
                accountType: fullUser.accountType,
                isStudentVerified: fullUser.isStudentVerified,
                trialExpirationDate: fullUser.trialExpirationDate,
                requested: fullUser.requested,
                followRequests: fullUser.followRequests,
            });
        }

        return res.status(200).json(basicInfo);

    } catch (error) {
        console.error("/users/:id error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Follow/unfollow logic
router.post('/follow/:id', isAuthenticated, async (req, res) => {
    const followUserId = req.params.id;
    const loggedInUserId = req.user.id;
    try {
        if (followUserId === loggedInUserId) return res.status(400).json({ message: 'You cannot follow yourself' });

        const loggedInUser = await UserModel.findById(loggedInUserId);
        const followUser = await UserModel.findById(followUserId);
        if (!loggedInUser || !followUser) return res.status(404).json({ message: 'User not found' });
        if (loggedInUser.following.includes(followUserId)) return res.status(400).json({ message: 'You are already following this user' });

        loggedInUser.following.push(followUserId);
        followUser.followers.push(loggedInUserId);
        await followUser.save();
        await loggedInUser.save();
        res.status(200).json({ message: 'User followed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/unfollow/:id', isAuthenticated, async (req, res) => {
    const unfollowUserId = req.params.id;
    const loggedInUserId = req.user.id;
    try {
        const loggedInUser = await UserModel.findById(loggedInUserId);
        const unfollowUser = await UserModel.findById(unfollowUserId);

        loggedInUser.following = loggedInUser.following.filter(id => id.toString() !== unfollowUserId);
        unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== loggedInUserId);

        await unfollowUser.save();
        await loggedInUser.save();
        res.status(200).json({ message: 'User unfollowed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Reset Password Routes
router.post("/forgotPassword", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(200).json({ message: "If this email exists, a reset link has been sent." });

        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
        await sendEmail(email, "Reset password", `Link: ${resetLink}`);

        return res.status(200).json({ message: "Reset link sent." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/resetPasswordWithToken", async (req, res) => {
    const { token, email, newPassword } = req.body;
    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await UserModel.findOne({
            email,
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired link." });

        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        return res.status(200).json({ message: "Password reset successful." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: `"Contact Form" <${process.env.GMAIL_USER}>`,
            to: process.env.CONTACT_RECEIVER_EMAIL,
            subject: "New Contact Form Submission",
            text: `From: ${name} <${email}>\nMessage: ${message}`,
            html: `<b>From:</b> ${name} &lt;${email}&gt;<br/><b>Message:</b><br/>${message}`
        });

        res.status(200).json({ message: "Your message has been received! We'll get back to you soon." });
    } catch (error) {
        console.error("Contact route error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

import fetch from 'node-fetch';

router.post('/openai-chat', async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.OPENAI_API_KEY; // put your key in .env

        if (!apiKey) {
            return res.status(500).json({ message: "Missing OpenAI API key" });
        }

        // Format messages for OpenAI Chat API
        const openaiMessages = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
        }));

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: openaiMessages
            })
        });

        const data = await response.json();
        // Handle error response
        if (!response.ok) return res.status(response.status).json(data);

        // Send back assistant's reply
        res.status(200).json({
            result: data.choices[0]?.message?.content || "No response.",
            openaiRaw: data
        });
    } catch (error) {
        res.status(500).json({ message: "OpenAI API error.", error: error.toString() });
    }
});

export default router;