const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const Application = require('../models/Application');

// Home page
router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find({ isActive: true })
      .sort({ publishDate: -1 })
      .limit(5);
    
    const services = await Service.find({ isActive: true })
      .limit(6);

    res.render('index', {
      title: 'PUNE CANTONMENT BOARD',
      notices,
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load homepage'
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us - Pune Cantonment Board'
  });
});

// Services page
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.render('services', {
      title: 'Services - Pune Cantonment Board',
      services
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load services'
    });
  }
});

// Notices page
router.get('/notices', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const notices = await Notice.find({ isActive: true })
      .sort({ publishDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notice.countDocuments({ isActive: true });
    const totalPages = Math.ceil(total / limit);

    res.render('notices', {
      title: 'Notices - Pune Cantonment Board',
      notices,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load notices'
    });
  }
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us - Pune Cantonment Board'
  });
});

// Contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message, department } = req.body;
    
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      department
    });

    await contact.save();
    
    res.render('contact', {
      title: 'Contact Us - Pune Cantonment Board',
      success: 'Your message has been sent successfully. We will get back to you soon.'
    });
  } catch (error) {
    console.error(error);
    res.render('contact', {
      title: 'Contact Us - Pune Cantonment Board',
      error: 'Failed to send message. Please try again.'
    });
  }
});

// Tenders page
router.get('/tenders', async (req, res) => {
  try {
    const tenders = await Notice.find({ 
      category: 'tender',
      isActive: true 
    }).sort({ publishDate: -1 });

    res.render('tenders', {
      title: 'Tenders - Pune Cantonment Board',
      tenders
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load tenders'
    });
  }
});

// Birth Certificate Application
router.get('/apply/birth-certificate', (req, res) => {
  res.render('forms/birth-certificate', {
    title: 'Birth Certificate Application - Pune Cantonment Board'
  });
});

router.post('/apply/birth-certificate', async (req, res) => {
  try {
    console.log('Received form data:', req.body); // Debug log
    
    const applicationData = {
      type: 'birth',
      applicantDetails: {
        name: req.body.applicantName || '',
        fatherName: req.body.applicantFatherName || '',
        motherName: req.body.applicantMotherName || '',
        address: req.body.applicantAddress || '',
        phone: req.body.applicantPhone || '',
        email: req.body.applicantEmail || '',
        relationToSubject: req.body.relationToSubject || ''
      },
      subjectDetails: {
        name: req.body.childName || '',
        gender: req.body.gender || '',
        dateOfEvent: req.body.dateOfBirth || new Date(),
        placeOfEvent: req.body.placeOfBirth || '',
        fatherName: req.body.fatherName || '',
        motherName: req.body.motherName || '',
        timeOfBirth: req.body.timeOfBirth || '',
        weight: req.body.weight || '',
        hospitalName: req.body.hospitalName || '',
        doctorName: req.body.doctorName || ''
      }
    };

    // Validate required fields
    const requiredFields = {
      applicantName: req.body.applicantName,
      applicantFatherName: req.body.applicantFatherName,
      applicantMotherName: req.body.applicantMotherName,
      applicantAddress: req.body.applicantAddress,
      applicantPhone: req.body.applicantPhone,
      applicantEmail: req.body.applicantEmail,
      relationToSubject: req.body.relationToSubject,
      childName: req.body.childName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      placeOfBirth: req.body.placeOfBirth,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.render('forms/birth-certificate', {
        title: 'Birth Certificate Application - Pune Cantonment Board',
        error: `Missing required fields: ${missingFields.join(', ')}. Please fill all required fields.`
      });
    }

    const application = new Application(applicationData);
    await application.save();

    res.render('forms/birth-certificate', {
      title: 'Birth Certificate Application - Pune Cantonment Board',
      success: `Application submitted successfully! Your application number is: ${application.applicationNumber}`,
      applicationNumber: application.applicationNumber
    });
  } catch (error) {
    console.error(error);
    res.render('forms/birth-certificate', {
      title: 'Birth Certificate Application - Pune Cantonment Board',
      error: 'Failed to submit application. Please try again.'
    });
  }
});

// Death Certificate Application
router.get('/apply/death-certificate', (req, res) => {
  res.render('forms/death-certificate', {
    title: 'Death Certificate Application - Pune Cantonment Board'
  });
});

router.post('/apply/death-certificate', async (req, res) => {
  try {
    console.log('Received death certificate form data:', req.body); // Debug log
    
    const applicationData = {
      type: 'death',
      applicantDetails: {
        name: req.body.applicantName || '',
        fatherName: req.body.applicantFatherName || '',
        motherName: req.body.applicantMotherName || '',
        address: req.body.applicantAddress || '',
        phone: req.body.applicantPhone || '',
        email: req.body.applicantEmail || '',
        relationToSubject: req.body.relationToSubject || ''
      },
      subjectDetails: {
        name: req.body.deceasedName || '',
        gender: req.body.gender || '',
        dateOfEvent: req.body.dateOfDeath || new Date(),
        placeOfEvent: req.body.placeOfDeath || '',
        fatherName: req.body.fatherName || '',
        motherName: req.body.motherName || '',
        causeOfDeath: req.body.causeOfDeath || '',
        ageAtDeath: req.body.ageAtDeath || '',
        occupation: req.body.occupation || '',
        maritalStatus: req.body.maritalStatus || ''
      }
    };

    // Validate required fields for death certificate
    const requiredFields = {
      applicantName: req.body.applicantName,
      applicantFatherName: req.body.applicantFatherName,
      applicantMotherName: req.body.applicantMotherName,
      applicantAddress: req.body.applicantAddress,
      applicantPhone: req.body.applicantPhone,
      applicantEmail: req.body.applicantEmail,
      relationToSubject: req.body.relationToSubject,
      deceasedName: req.body.deceasedName,
      gender: req.body.gender,
      dateOfDeath: req.body.dateOfDeath,
      placeOfDeath: req.body.placeOfDeath,
      fatherName: req.body.fatherName,
      motherName: req.body.motherName
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.render('forms/death-certificate', {
        title: 'Death Certificate Application - Pune Cantonment Board',
        error: `Missing required fields: ${missingFields.join(', ')}. Please fill all required fields.`
      });
    }

    const application = new Application(applicationData);
    await application.save();

    res.render('forms/death-certificate', {
      title: 'Death Certificate Application - Pune Cantonment Board',
      success: `Application submitted successfully! Your application number is: ${application.applicationNumber}`,
      applicationNumber: application.applicationNumber
    });
  } catch (error) {
    console.error(error);
    res.render('forms/death-certificate', {
      title: 'Death Certificate Application - Pune Cantonment Board',
      error: 'Failed to submit application. Please try again.'
    });
  }
});

// Application Status Check
router.get('/check-status', (req, res) => {
  res.render('check-status', {
    title: 'Check Application Status - Pune Cantonment Board'
  });
});

// System Information Page
router.get('/info', (req, res) => {
  res.render('info', {
    title: 'System Information - Pune Cantonment Board'
  });
});

// Admin Test Page
router.get('/admin-test', (req, res) => {
  res.render('admin-test', {
    title: 'Admin Login Test - Pune Cantonment Board'
  });
});

router.post('/check-status', async (req, res) => {
  try {
    const { applicationNumber } = req.body;
    const application = await Application.findOne({ applicationNumber });

    if (!application) {
      return res.render('check-status', {
        title: 'Check Application Status - Pune Cantonment Board',
        error: 'Application not found. Please check your application number.'
      });
    }

    res.render('check-status', {
      title: 'Check Application Status - Pune Cantonment Board',
      application
    });
  } catch (error) {
    console.error(error);
    res.render('check-status', {
      title: 'Check Application Status - Pune Cantonment Board',
      error: 'Failed to check status. Please try again.'
    });
  }
});

module.exports = router;