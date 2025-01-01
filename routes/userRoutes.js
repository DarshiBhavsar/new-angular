const express = require('express');
const taskController = require('../controllers/taskController');
const router = express.Router();
const upload = require('../midddleware/multer');

router.post('/register', upload.single('image'), taskController.registerStaff);

router.post('/login', taskController.loginUser);

router.get('/userData', taskController.getUserData);

router.get('/:id', taskController.getUserDetails);

router.put('/:id', upload.single('image'), taskController.updateUser);

router.delete('/:id', taskController.deleteUser);

module.exports = router;
