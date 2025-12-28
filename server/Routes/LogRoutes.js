import { Router } from 'express';
import UserModel from '../db/models/Users.js';
import LogModel from '../db/models/Logs.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import multer from 'multer';
import cloudinary from '../util/cloudinary.js';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// --- 1. GET ALL LOGS (OWN) ---
router.get('/log', isAuthenticated, async (req, res) => {
    try {
        // ---- DAILY CHECK-IN (+1 coin once/day) ----
        const user = await UserModel.findById(req.user.id);
        const now = new Date();
        if (
            !user.lastDailyCheck ||
            now.toDateString() !== user.lastDailyCheck.toDateString()
        ) {
            user.coins += 1;
            user.lastDailyCheck = now;
            await user.save();
        }
        // ---- END DAILY CHECK-IN ----

        const { search, status } = req.query;
        let query = { user: req.user.id };

        if (status && status !== 'All') query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const logs = await LogModel.find(query)
            .populate('user', 'username email profilePic')
            .populate('likes', 'username profilePic')
            .populate('comments.user', 'username profilePic')
            .sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 2. CREATE LOG (With File Upload) ---
// --- CREATE LOG route must match the schema field names ---
router.post('/log/create', isAuthenticated, upload.single('file'), async (req, res) => {
    const { title, description, status } = req.body;
    let attachmentUrl = "";

    try {
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: "logbook_uploads",
                    resource_type: "auto"
                });
                attachmentUrl = result.secure_url;
            } catch (cloudErr) {
                console.error("Cloudinary upload error:", cloudErr);
                return res.status(500).json({ message: 'File upload error', error: cloudErr.message });
            } finally {
                fs.unlink(req.file.path, err => { if (err) console.error("File cleanup error:", err); });
            }
        }

        const log = new LogModel({
            user: req.user.id,
            title,
            description,
            status: status || 'Pending',
            attachment: attachmentUrl,
            coins: 10
        });
        await log.save();

        await UserModel.findByIdAndUpdate(
            req.user.id,
            { $push: { Logs: log._id }, $inc: { coins: 10 } },
            { new: true }
        );

        res.status(201).json({ message: 'Log created successfully', log });
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 3. UPDATE LOG (+2 coins for successful edit within 24h) ---
router.post('/log/update/:id', isAuthenticated, async (req, res) => {
    const logId = req.params.id;
    const { title, description, attachment, status } = req.body;

    try {
        const log = await LogModel.findById(logId);
        if (!log) return res.status(404).json({ message: 'Log not found' });
        if (log.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action' });
        }

        const createdTime = new Date(log.createdAt).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - createdTime) / (1000 * 60 * 60);
        if (hoursDiff > 24) {
            return res.status(403).json({ message: 'Logs can only be edited within 24 hours of creation.' });
        }

        if (title) log.title = title;
        if (description) log.description = description;
        if (attachment) log.attachment = attachment;
        if (status) log.status = status;

        await log.save();

        // Award coins for edit
        await UserModel.findByIdAndUpdate(req.user.id, { $inc: { coins: 2 } });

        res.status(200).json({ message: 'Log updated successfully', log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 4. GET SINGLE LOG (with all populate fields!!) ---
router.get('/log/:id', isAuthenticated, async (req, res) => {
    const logId = req.params.id;
    try {
        const log = await LogModel.findById(logId)
            .populate('user', 'username email profilePic followers')
            .populate('likes', 'username profilePic')
            .populate('comments.user', 'username profilePic');

        if (!log) return res.status(404).json({ message: 'Log not found' });

        const logOwnerId = log.user._id ? log.user._id.toString() : log.user.toString();
        if (logOwnerId === req.user.id) return res.status(200).json(log);

        const isFollower = (log.user.followers || []).some(f => f.toString() === req.user.id);

        if (isFollower) {
            return res.status(200).json(log);
        } else {
            return res.status(403).json({ message: 'You are not allowed to view this log.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- 5. TOGGLE LIKE (with badge/coin logic) ---
router.put('/log/like/:id', isAuthenticated, async (req, res) => {
    try {
        const log = await LogModel.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        const index = log.likes.map(id => String(id)).indexOf(req.user.id);

        if (index === -1) {
            log.likes.push(req.user.id);
        } else {
            log.likes.splice(index, 1);
        }

        await log.save();

        // AWARD BADGES/COINS FOR LIKES+COMMENTS
        await handleLogLikeCommentBadge(log);

        // Return likes (populated) for immediate UI update
        const populated = await LogModel.findById(log._id)
            .populate('likes', 'username profilePic');
        res.json(populated.likes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- 6. ADD COMMENT (with badge/coin logic) ---
router.post('/log/comment/:id', isAuthenticated, async (req, res) => {
    try {
        const log = await LogModel.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        log.comments.unshift(newComment);
        await log.save();

        // AWARD BADGES/COINS FOR LIKES+COMMENTS
        await handleLogLikeCommentBadge(log);

        // Return all comments (populated) for immediate UI update
        const updatedLog = await LogModel.findById(req.params.id)
            .populate('comments.user', 'username profilePic');
        res.json(updatedLog.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- BADGES & COIN LOGIC (called after like/comment) ---
async function handleLogLikeCommentBadge(log) {
    const total = (log.likes?.length || 0) + (log.comments?.length || 0);

    if (total >= 100 && !log.got100Badge) {
        await UserModel.findByIdAndUpdate(log.user, {
            $inc: { coins: 50 },
            $addToSet: { badges: "Bachae" }
        });
        log.got100Badge = true;
        await log.save();
    }
    if (total >= 1000 && !log.got1000Badge) {
        await UserModel.findByIdAndUpdate(log.user, {
            $inc: { coins: 200 },
            $addToSet: { badges: "Superstar" }
        });
        log.got1000Badge = true;
        await log.save();
    }
}

// --- 7. ACTIVITY FEED ---
router.get('/feed', isAuthenticated, async (req, res) => {
    try {
        const currentUser = await UserModel.findById(req.user.id);

        const feedLogs = await LogModel.find({
            user: { $in: currentUser.following }
        })
            .populate('user', 'username email profilePic')
            .populate('likes', 'username profilePic')
            .populate('comments.user', 'username profilePic')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json(feedLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- 8. DELETE LOG ---
router.delete('/log/:id', isAuthenticated, async (req, res) => {
    try {
        const log = await LogModel.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        if (log.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }

        await UserModel.findByIdAndUpdate(log.user, { $pull: { Logs: log._id } });

        await log.deleteOne();

        res.status(200).json({ message: 'Log deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

export default router;