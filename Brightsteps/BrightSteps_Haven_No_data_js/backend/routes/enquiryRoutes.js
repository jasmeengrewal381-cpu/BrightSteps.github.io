
import express from 'express';
import mongoose from 'mongoose';
import { sendAppointmentEmails } from '../utils/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      name,
      parentName,
      email,
      phone,
      childAge,
      service,
      date,
      subject,
      message
    } = req.body;

    const isAppointment =
      Object.prototype.hasOwnProperty.call(req.body, 'parentName') ||
      Object.prototype.hasOwnProperty.call(req.body, 'service') ||
      Object.prototype.hasOwnProperty.call(req.body, 'date') ||
      Object.prototype.hasOwnProperty.call(req.body, 'childAge');

    if (isAppointment) {
      if (!parentName || !phone || !service || !date || !message) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in your name, phone, service, date and message.'
        });
      }

      const appointment = {
        parentName: parentName.trim(),
        email: (email || '').trim(),
        phone: phone.trim(),
        childAge: childAge || '',
        service: service.trim(),
        date,
        message: message.trim(),
        createdAt: new Date()
      };

      await mongoose.connection
        .collection('appointment')
        .insertOne(appointment);

      try {
        await sendAppointmentEmails(appointment);
      } catch (emailError) {
        console.error(
          'Appointment email failed:',
          emailError.message
        );
      }

      return res.status(201).json({
        success: true,
        message: 'Appointment saved successfully.'
      });
    }

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in your name, email, subject and message.'
      });
    }

    const enquiry = {
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date()
    };

    await mongoose.connection
      .collection('enquiries')
      .insertOne(enquiry);

    return res.status(201).json({
      success: true,
      message: 'Enquiry saved successfully.'
    });

  } catch (error) {
    console.error('Form submission error:', error);

    return res.status(500).json({
      success: false,
      message: 'Could not save your form. Please try again.'
    });
  }
});

export default router;
