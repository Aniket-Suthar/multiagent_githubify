const Validator = require('validator');

// Function to validate registration input
const validateRegisterInput = (data) => {
    let errors = {};

    // Validate username
    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username is required';
    }

    // Validate email
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // Validate password
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    } else if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must be at least 6 characters';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

// Function to validate login input
const validateLoginInput = (data) => {
    let errors = {};

    // Validate email
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // Validate password
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};

module.exports = {
    validateRegisterInput,
    validateLoginInput
};
