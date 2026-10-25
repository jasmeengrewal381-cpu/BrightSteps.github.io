
import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { sendAppointmentStatusEmail } from '../utils/emailService.js';

const router = express.Router();

function requireAdmin(req, res, next) {
  if (!req.session || !req.session.isAdmin) {
    return res.status(401).json({
      success: false,
      message: 'Please log in as admin.'
    });
  }

  next();
}

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const passwordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Enter your username and password.'
      });
    }

    if (!adminUsername || !passwordHash) {
      return res.status(500).json({
        success: false,
        message: 'Admin login is not configured.'
      });
    }

    const usernameMatches = username === adminUsername;
    const passwordMatches = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Could not create login session.'
        });
      }

      req.session.isAdmin = true;

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            success: false,
            message: 'Could not save login session.'
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Admin login successful.'
        });
      });
    });
  } catch (error) {
    console.error('Admin login error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

router.get('/me', requireAdmin, (req, res) => {
  res.json({
    success: true,
    username: process.env.ADMIN_USERNAME
  });
});

router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const [
      appointments,
      enquiries,
      pendingAppointments,
      newEnquiries
    ] = await Promise.all([
      db.collection('appointment').countDocuments(),
      db.collection('enquiries').countDocuments(),
      db.collection('appointment').countDocuments({
        status: { $in: ['Pending', 'New'] }
      }),
      db.collection('enquiries').countDocuments({
        $or: [
          { status: 'New' },
          { status: { $exists: false } }
        ]
      })
    ]);

    res.json({
      success: true,
      totals: {
        appointments,
        enquiries,
        pendingAppointments,
        newEnquiries
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Could not load dashboard.'
    });
  }
});

router.get('/appointments', requireAdmin, async (req, res) => {
  try {
    const appointments = await mongoose.connection.db
      .collection('appointment')
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Appointments error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Could not load appointments.'
    });
  }
});

router.patch('/appointments/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment status.' });
    }

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid appointment ID.' });
    }

    const collection = mongoose.connection.db.collection('appointment');
    const _id = new mongoose.Types.ObjectId(req.params.id);
    const appointment = await collection.findOne({ _id });

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (appointment.status === status) {
      return res.json({ success: true, emailSent: false, message: 'Status was already set to this value.' });
    }

    await collection.updateOne({ _id }, { $set: { status, updatedAt: new Date() } });

    let emailSent = false;
    let emailMessage = 'Status saved, but no parent email address is saved.';

    if (appointment.email && appointment.email.trim()) {
      try {
        await sendAppointmentStatusEmail(appointment, status);
        emailSent = true;
        emailMessage = 'Status saved and email accepted by the mail service.';
      } catch (emailError) {
        console.error('Appointment status email failed:', emailError.message);
        emailMessage = 'Status saved, but the email could not be sent. Check the backend terminal.';
      }
    }

    return res.json({ success: true, message: 'Appointment status updated.', emailSent, emailMessage });
  } catch (error) {
    console.error('Status update error:', error.message);
    return res.status(500).json({ success: false, message: 'Could not update appointment status.' });
  }
});

router.get('/enquiries', requireAdmin, async (req, res) => {
  try {
    const enquiries = await mongoose.connection.db
      .collection('enquiries')
      .find({})
      .sort({ createdAt: -1 })
      .limit(500)
      .toArray();

    res.json({
      success: true,
      enquiries
    });
  } catch (error) {
    console.error('Enquiries error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Could not load enquiries.'
    });
  }
});



router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.json({
      success: true,
      message: 'Already logged out.'
    });
  }

  delete req.session.isAdmin;

  req.session.save((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out.'
      });
    }

    return res.json({
      success: true,
      message: 'Admin logged out successfully.'
    });
  });
});
export default router;