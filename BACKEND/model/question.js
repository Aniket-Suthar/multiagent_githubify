const mongoose = require('mongoose');

const codingQuestionSchema = new mongoose.Schema({
    questionName: {
        type: String,
        required: true
    },
    difficultyLevel: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    conceptType: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    }
});

const CodingQuestion = mongoose.model('CodingQuestion', codingQuestionSchema);

module.exports = CodingQuestion;
