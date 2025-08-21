const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Contact = require('../models/Contact');
const Service = require('../models/Service');

// Get all notices
router.get('/notices', async (req, res) => {
  try {
    const { category, limit = 10, page = 1 } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    const notices = await Notice.find(query)
      .sort({ publishDate: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({
      success: true,
      data: notices,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices'
    });
  }
});

// Get single notice
router.get('/notices/:id', async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: 'Notice not found'
      });
    }

    // Increment view count
    notice.views += 1;
    await notice.save();

    res.json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notice'
    });
  }
});

// Get all services
router.get('/services', async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    const services = await Service.find(query);

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services'
    });
  }
});

// Submit contact form
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
    
    res.json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form'
    });
  }
});

// Search notices
router.get('/search', async (req, res) => {
  try {
    const { q, category } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      isActive: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    };

    if (category) {
      query.category = category;
    }

    const notices = await Notice.find(query)
      .sort({ publishDate: -1 })
      .limit(20);

    res.json({
      success: true,
      data: notices,
      query: q
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// Get application by number
router.get('/applications/by-number/:applicationNumber', async (req, res) => {
  try {
    const { applicationNumber } = req.params;
    const Application = require('../models/Application');
    
    const application = await Application.findOne({ applicationNumber });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application'
    });
  }
});

module.exports = router;