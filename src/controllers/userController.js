const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


exports.registerUser = async (req, res) => {
  // register new user only if we dont have already another user
  // with the same mail
  
  const mail = req.body.mail;
  
  const existingUser = await User.findOne({ mail });
  if (existingUser) {
    return res.status(409).json({error: "Email already exists."});
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    mail: mail,
    password: hashedPassword,
    admin: req.body.admin
  });

  try {
    
    const newUser = await user.save();
    
    // token for authorization during the session
    const token = jwt.sign({ userId: newUser._id }, 'secretKey');

    res.status(201).json({newUser, token});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const mail = req.body.mail;
  
  const existingUser = await User.findOne({mail});
  if (!existingUser) {
    return res.status(401).json({error: 'User not found.'});
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials.'});
  }

  try {
    const token = jwt.sign({ userId: existingUser._id }, 'secretKey');
    res.status(201).json({token});
  } catch (err) {
    res.status(400).json({message: err.message });
  }
}

exports.verifyToken = async (req, res) => {
  const token = req.body.token;

  if (!token) {
    res.json({ auth: false });
  }

  try {
    const decodedToken = jwt.decode(token, 'secretKey');
    const userId = decodedToken.userId;

    User.findById(userId, (err, user) => {
      if (err || !user) {
        res.json({ auth: false });
      }

      res.json({ auth: true, user });
    });
  } catch (err) {
    res.json({auth: false});
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const events = await User.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.getNotifications = async (req, res) => {
  const userMail = req.params.mail;

  try {
    const user = await User.findOne({ mail: userMail });
    res.status(200).json(user.notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}