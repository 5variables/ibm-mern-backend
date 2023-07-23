const Event = require('../models/eventModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

async function sendEmail(invitation, eventTitle, description, eventId) {
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
    subject: 'You are invited to ' + eventTitle + "!",
    text: description + '\n\nClick the link below to confirm your participation.\n\n',
    html: '<p>Click <a href="http://localhost:3000/event/' + eventId +'">here</a> to confirm your participation.</p>',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent to', invitation, ':', info.response);
  } catch (error) {
    console.error('Error sending email to', invitation, ':', error);
  }
}

exports.createEvent = async (req, res) => {
  const event = new Event({
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    location: req.body.location,
    invitations: req.body.invitations,
  });

  
  try {
    const newEvent = await event.save();

    const invitations = req.body.invitations;
  
    const eventId = newEvent._id;
    
    invitations.forEach((invitation) => {
      sendEmail(invitation, req.body.title, req.body.description, eventId);
    });
    
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.confirmation = async (req, res) => {
  const eventId = req.params.eventId;
  const userMail = req.params.userMail;

  try {
    // Find the event by its ID
    const event = await Event.findById(eventId);

    if (!event) {
      // Event not found
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the userMail is present in the invitations array
    const invitationIndex = event.invitations.indexOf(userMail);

    if (invitationIndex === -1) {
      // userMail is not found in the invitations array
      return res.status(400).json({ message: 'Invalid userMail for this event' });
    }

    // Remove the userMail from the invitations array
    event.invitations.splice(invitationIndex, 1);

    // Add the userMail to the participants list
    event.participants.push(userMail);

    // Save the updated event
    await event.save();

    // Return a success message or any other response as needed
    return res.status(200).json({ message: 'Event confirmation successful' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error confirming event:', error);
    return res.status(500).json({ message: 'An error occurred while confirming the event' });
  }
};

exports.attend = async (req, res) => {
  const eventId = req.params.eventId;
  const userMail = req.params.userMail;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

     // Add the userMail to the participants list
     event.participants.push(userMail);

     // Save the updated event
     await event.save();
 
     // Return a success message or any other response as needed
     return res.status(200).json({ message: 'Event confirmation successful' });

  } catch (error) {
    console.error('Error confirming event:', error);
    return res.status(500).json({ message: 'An error occurred while confirming the event' });
  }

}