const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const SERVER_IP = 'localhost';
const PORT = 3000;

exports.registerStaff = async (req, res) => {
    try {
        console.log("hello");
        const { Name, email, password, image } = req.body;
        // const image = req.file ? req.file.filename : null;

        console.log('Request Data:', req.body);

        if (!image) {
            return res.status(400).json({ message: 'Image is required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword);

        const newUser = new User({
            Name,
            email,
            password: hashedPassword,
            image,
        });

        console.log('New User Data:', newUser);
        await newUser.save();

        if (newUser.image) {
            newUser.image = `http://${SERVER_IP}:${PORT}/uploads/${newUser.image}`;
        }
        console.log('User saved successfully');

        res.status(201).json({
            message: 'User registered successfully',
        });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({
            status: false,
            error: error
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password.' });
        }

        const token = Jwt.sign(
            { userId: user._id, type: user.type },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            type: user.type,
            userId: user._id,
            message: 'Login successful',
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserData = async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        // If image is stored in Base64, you don't need to modify the image field
        const itemsWithFullImagePath = users.map(item => {
            // Check if image exists
            if (item.image) {
                // No need to convert the image URL here if it's Base64
                item.image = item.image; // Just return the Base64 string as it is
            }
            delete item.type; // Remove the 'type' field
            return item;
        });

        return res.status(200).json(itemsWithFullImagePath);

    } catch (error) {
        console.error('Error fetching user data:', error.message);
        return res.status(500).json({ error: error.message });
    }
};



exports.getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const userId = req.params.id;
        const { Name, email, image } = req.body;
        const existingUser = await User.findById(req.params.id)
        // const updatedImage = req.file ? req.file.filename : existingUser.image;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                Name,
                email,
                image,
            },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json({
            message: 'User updated successfully',
            user,
        });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: error.message });
    }
};
