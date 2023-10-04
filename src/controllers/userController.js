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

exports.delete = async (req, res) => {
  const id = req.params.id;

  try {

    // Use the deleteOne method to remove the user by _id
    const result = await User.deleteOne({ _id: id });

    // Check if a document was deleted
    if (result.deletedCount === 1) {
      return res.status(200).json({ message: 'User deleted successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateFirstName = async (req, res) => {
  const id = req.params.id;
  const value = req.params.value;

  try {

    // Use the updateOne method to update the firstName field
    const result = await User.updateOne(
      { _id: id },
      { $set: { firstName: value } }
    );

    // Check if a document was updated
    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'firstName updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateLastName = async (req, res) => {
  const id = req.params.id;
  const value = req.params.value;

  try {

    // Use the updateOne method to update the firstName field
    const result = await User.updateOne(
      { _id: id },
      { $set: { lastName: value } }
    );

    // Check if a document was updated
    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'lastName updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateMail = async (req, res) => {
  const id = req.params.id;
  const value = req.params.value;

  try {

    // Use the updateOne method to update the firstName field
    const result = await User.updateOne(
      { _id: id },
      { $set: { mail: value } }
    );

    // Check if a document was updated
    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'mail updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updatePassword = async (req, res) => {
  const id = req.params.id;
  const value = req.params.value;

  try {

    const hashedPassword = await bcrypt.hash(value, 10);

    // Use the updateOne method to update the firstName field
    const result = await User.updateOne(
      { _id: id },
      { $set: { password: hashedPassword } }
    );

    // Check if a document was updated
    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'mail updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  // const firstName = req.params.firstName;
  // const lastName = req.params.lastName;
  // const email = req.params.email;
  // const password = req.params.password;
  const updateFields = {};

  // Check if each field is not empty and update the corresponding field
  if (req.params.firstName !== null) {
    updateFields.firstName = req.params.firstName;
  }

  if (req.params.lastName !== null) {
    updateFields.lastName = req.params.lastName;
  }

  if (req.params.email !== null) {
    updateFields.email = req.params.email;
  }

  if (req.params.password !== null) {
    // Hash the password before updating it
    const hashedPassword = await bcrypt.hash(req.params.password, 10);
    updateFields.password = hashedPassword;
  }

  try {
    const result = await User.updateOne(
      { _id: id },
      { $set: updateFields }
    );

    // Check if a document was updated
    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'Fields updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}