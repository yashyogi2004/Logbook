const router = require('express').Router();
const UserModel = require('../db/models/Users');
const LogModel = require('../db/models/Logs');
const isAuthenticated = require('../controller/AuthController');

router.get('/logs', isAuthenticated, async (req, res) => {
    try {
        const logs = await LogModel.find({ user: req.user.id }).populate('user', 'username email');
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/log/create', isAuthenticated, async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const log = new LogModel({
            user: req.user.id,
            task_title: title,
            task_description: description,
            status: status,
        });
        await log.save();
        // Optionally, you can also update the user's logs array
        await UserModel.findByIdAndUpdate(req.user.id, {
            $push: { Logs: log._id }
        });
        res.status(201).json({ message: 'Log created successfully', log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

 
router.get('/logs/:id',isAuthenticated, async (req, res) => {
    const userId = req.params.id;
    try {
        const logs = await LogModel.find({ user: userId }).populate('user', 'username email');
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
