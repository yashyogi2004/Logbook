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
    const { title, description, status,attachment } = req.body;
    try {
        const log = new LogModel({
            user: req.user.id,
            task_title: title,
            task_description: description,
            status: status,
            attachment:attachment
        });
        const user = await UserModel.findById(req.user.id);
        user.Logs.push(log._id);
        await user.save();
        await log.save();
        res.status(201).json({ message: 'Log created successfully', log });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// update log status with in 24 hours only other wise deny
router.post('/log/update/:id', isAuthenticated, async (req, res) => {
    const logId = req.params.id;
    const { status } = req.body;
    try {
    const log = await LogModel.findById(logId);
    if (!log) {
        return res.status(404).json({ message: 'Log not found' });
    }
    const todayDate = new Date().toISOString().split("T")[0] ;
    const logDate = log.createdAt.toISOString().split("T")[0];
     if(todayDate !== logDate){
        return res.status(403).json({ message: 'Log can be updated within 24 hours only' });
     }else{
        if(log.user.toString() !== req.user.id){
            return res.status(403).json({ message: 'Unauthorized' });
        }
        log.status = status;
        await log.save();
        res.status(200).json({ message: 'Log status updated successfully', log });
     }
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

router.get('/logs/search', isAuthenticated, async (req, res) => {
    const query = req.query;
    try {
    
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

