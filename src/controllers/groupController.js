const Group = require('../models/groupModel');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendEmail(invitation, groupTitle, groupId) {
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

        
        invitations.forEach(async (invitation) => {
          const user = await User.findOne({ mail: invitation });
          user.notifications.push(group._id);
          await user.save();
        })

        
    
        // invitations.forEach((invitation) => {
        //     sendEmail(invitation, name, groupId);
        // });
      
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

exports.getGroupNameFromGroupId = async (req, res) => {
    try {
        const group = await Group.findById(req.params.groupId);

        await group.save();

        res.status(200).json(group);
    } catch (error) {
        console.log("Error getting the group", error);
        res.status(500).json({ message: 'An error occurred while confirming the group' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const events = await Group.find();
        res.json(events);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
}

exports.invite = async (req, res) => {
  const groupName = req.params.groupName;
  const userMail = req.params.userMail;

  try {
    const group = await Group.findOne({ name: groupName });
    const user = await User.findOne({ mail: userMail });

    user.notifications.push(group._id);
    
    await user.save();
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.confirmInvite = async (req, res) => {
  const groupId = req.params.groupId;
  const userMail = req.params.userMail;

  try {

    // Update the group document to add the userMail to the members field
    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userMail } }, // $addToSet ensures no duplicate entries
      { new: true } // Return the updated document
    );

    // Find the user by mail and update both groups and notifications fields
    const user = await User.findOneAndUpdate(
      { mail: userMail },
      { $addToSet: { groups: groupId }, $pull: { notifications: groupId } },
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: 'Invite confirmed successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

exports.quitGroup = async (req, res) => {
  const groupId = req.params.groupId;
  const userMail = req.params.userMail;

  try {
    // Update the group document to remove the userMail from the members field
    // const group = await Group.findByIdAndUpdate(
    //   groupId,
    //   { $pull: { members: userMail } },
    //   { new: true }
    // );

    // Update the user document to remove the groupId from the groups field
    const user = await User.findOneAndUpdate(
      { mail: userMail },
      { $pull: { groups: groupId } },
      { new: true }
    );

    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};