const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Cookies = require("js-cookie")
const { validateRegisterInput, validateLoginInput } = require('../validator/user');

exports.registerUser = async (req, res) => {
    // Validate the input data
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
        return res.status(400).json({ email: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    console.log(newUser);

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
};

exports.loginUser = async (req, res) => {
    try { // Validate the input data
        const { errors, isValid } = validateLoginInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // Find the user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ email: 'Email not found' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ password: 'Incorrect password' });
        }

        // Generate JWT tokens
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET);

        // Send the tokens to the client
        const options = {
            sameSite: 'none',
            secure: true,
            httpOnly: false
        }

        res.status(200)
            .cookie("access", accessToken, options)
            .json({ message: "User Found", userId: user._id, accessToken, refreshToken });

    }

    catch (err) {
        console.log(err)
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie("access")

    res.sendStatus(200, { "message": "User Logged Out successfully" });
};
