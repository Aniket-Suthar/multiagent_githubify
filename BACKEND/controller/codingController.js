const CodingQuestion = require('../model/question');

// Controller function to handle adding a new coding question
exports.addCodingQuestion = async (req, res) => {
    try {
        const { questionName, difficultyLevel, url, conceptType } = req.body;
        const userId = req.user.userId;
        console.log(userId)// Retrieve user ID from authenticated request
        const codingQuestion = new CodingQuestion({
            questionName,
            difficultyLevel,
            url,
            conceptType,
            createdBy: userId // Save the user ID with the question
        });
        await codingQuestion.save();
        res.json(codingQuestion);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
};


// Controller function to get all questions for the logged-in user
exports.getAllQuestions = async (req, res) => {
    try {
        // Query all questions created by the logged-in use
        const questions = await CodingQuestion.find({ createdBy: req.user.userId });
        console.log(req.user.userId)
        res.json(questions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.updateQuestion = async (req, res) => {
    const { questionName, difficultyLevel, url, conceptType } = req.body;
    const { id } = req.params;

    try {
        // Find the question by ID and update it
        const updatedQuestion = await CodingQuestion.findByIdAndUpdate(id, {
            questionName,
            difficultyLevel,
            url,
            conceptType
        }, { new: true }); // Set { new: true } to return the updated document
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(updatedQuestion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the question by ID and delete it
        const deletedQuestion = await CodingQuestion.findByIdAndDelete(id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};