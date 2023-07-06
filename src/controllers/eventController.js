const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Event = require('../models/eventModel');
const User = require('../models/userModel');

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location,
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

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