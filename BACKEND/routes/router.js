const express = require('express');
const router = express.Router();
const { addCodingQuestion, getAllQuestions, updateQuestion, deleteQuestion } = require('../controller/codingController');
const userController = require('../controller/userController');
const { authenticateToken } = require('../middleware/authenticUser');
const postController = require('../controller/postController');
// Route to add a new coding question
router.post('/codingQuestions', authenticateToken, addCodingQuestion);

// Route to get all questions for the logged-in user
router.get('/getallquestion', authenticateToken, getAllQuestions);

// Register a new user
router.post('/register', userController.registerUser);

// login
router.post('/login', userController.loginUser);

// Get User Profile
// router.get('/profile', userController.getUserProfile);

router.post('/logout', userController.logoutUser);

// Update a coding question
router.put('/updatequestion/:id', updateQuestion);

// Delete a coding question
router.delete('/deletequestion/:id', deleteQuestion);

router.get('/getuser', (req, res) => {
    res.send('Hello');
})

router.post('/posts', postController.createPost);

router.get('/posts', postController.getAllPosts);

module.exports = router;