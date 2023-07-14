const Group = require('../models/groupModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(invitation, groupTitle, members, groupId) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cristicanceal@gmail.com',
        pass: process.env.GMAIL_PASS
      }
    });
  
    const mailOptions = {
      from: 'cristicanceal@gmail.com',
      to: invitation,
      subject: 'You are invited to be a member of ' + groupTitle + "!",
    //   text: '\n\nClick the link below to see the group.\n\nMembers in this group: ' + members,
      html: '<p>Click <a href="http://localhost:3001/groups/confirmation/' + groupId + '/' + invitation +'">here</a> to confirm.</p>',
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent to', invitation, ':', info.response);
    } catch (error) {
      console.error('Error sending email to', invitation, ':', error);
    }
  }

exports.createGroup = async (req, res) => {

    const { name, invitations, members } = req.body;
    
    
    const group = new Group({
        name: name,
        invitations: invitations,
        members: members,
    });
    
    try {
        const newGroup = await group.save();
        const groupId = newGroup._id;  
    
        invitations.forEach((invitation) => {
            sendEmail(invitation, name, members, groupId);
        });
    
        res.status(201).json(newGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.confirmation = async (req, res) => {
    const groupId = req.params.groupId;
    const userMail = req.params.userMail;
  
    try {
      // Find the group by its ID
      const group = await Group.findById(groupId);
      const user = await User.findOne({ mail: userMail });
  
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
      const invitationIndex = group.invitations.indexOf(userMail);
  
      if (invitationIndex === -1) {
        // userMail is not found in the invitations array
        return res.status(400).json({ message: 'Invalid userMail for this group' });
      }

      group.invitations.splice(invitationIndex, 1);
      group.members.push(userMail);
      user.groups.push(groupId);
  
      await group.save();
      await user.save();
      
      return res.status(200).json({ message: 'Group confirmation successful' });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error confirming group:', error);
      return res.status(500).json({ message: 'An error occurred while confirming the group' });
    }
  };