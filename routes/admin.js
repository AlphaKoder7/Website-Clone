const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Application = require('../models/Application');

// Simple authentication middleware (replace with proper auth in production)
const requireAuth = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/admin/login');
  }
};

// Admin login page
router.get('/login', (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login'
  });
});

// Test credentials endpoint (for debugging)
router.get('/test-credentials', (req, res) => {
  const validCredentials = [
    { username: 'admin', password: 'password' },
    { username: 'pcb_admin', password: '123456' },
    { username: 'test', password: 'test123' }
  ];
  
  res.json({
    message: 'Valid credentials for testing',
    credentials: validCredentials,
    loginUrl: '/admin/login'
  });
});

// Direct login routes for testing (bypasses form)
router.get('/direct-login/:username/:password', (req, res) => {
  const { username, password } = req.params;
  
  console.log('Direct login attempt:', { username, password });
  
  const validCredentials = [
    { username: 'admin', password: 'password' },
    { username: 'pcb_admin', password: '123456' },
    { username: 'test', password: 'test123' }
  ];
  
  const matchedCredential = validCredentials.find(cred => 
    cred.username === username && cred.password === password
  );
  
  if (matchedCredential) {
    req.session.isAdmin = true;
    req.session.username = username;
    console.log('Direct login successful for:', username);
    res.redirect('/admin/dashboard');
  } else {
    console.log('Direct login failed for:', username);
    res.redirect('/admin/login?error=direct_login_failed');
  }
});

// Admin login handler
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  console.log('Login attempt:', { username, password }); // Debug log
  
  // Test credentials for development
  const validCredentials = [
    { username: 'admin', password: 'password' },
    { username: 'pcb_admin', password: '123456' },
    { username: 'test', password: 'test123' }
  ];
  
  const matchedCredential = validCredentials.find(cred => 
    cred.username === username && cred.password === password
  );
  
  console.log('Matched credential:', matchedCredential); // Debug log
  
  if (matchedCredential) {
    req.session.isAdmin = true;
    req.session.username = username;
    console.log('Login successful for:', username); // Debug log
    res.redirect('/admin/dashboard');
  } else {
    console.log('Login failed for:', username); // Debug log
    res.render('admin/login', {
      title: 'Admin Login',
      error: `Invalid credentials. Received: ${username}/${password}. Try: admin/password, pcb_admin/123456, or test/test123`
    });
  }
});

// Admin dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const contactCount = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    
    // Application statistics
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const birthApplications = await Application.countDocuments({ type: 'birth' });
    const deathApplications = await Application.countDocuments({ type: 'death' });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {
        contacts: contactCount,
        pendingContacts,
        totalApplications,
        pendingApplications,
        birthApplications,
        deathApplications
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load dashboard'
    });
  }
});

// Notices and Services routes removed - not fully developed

// Contacts management
router.get('/contacts', requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.render('admin/contacts', {
      title: 'Manage Contacts',
      contacts
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load contacts'
    });
  }
});

// Applications management
router.get('/applications', requireAuth, async (req, res) => {
  try {
    const { type, status } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    
    const applications = await Application.find(query).sort({ createdAt: -1 });
    
    res.render('admin/applications', {
      title: 'Manage Applications',
      applications,
      currentType: type,
      currentStatus: status
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load applications'
    });
  }
});

// View single application
router.get('/applications/:id', requireAuth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).render('error', { 
        title: 'Error',
        message: 'Application not found'
      });
    }
    
    res.render('admin/application-details', {
      title: 'Application Details',
      application
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load application'
    });
  }
});

// Update application status
router.post('/applications/:id/status', requireAuth, async (req, res) => {
  try {
    const { status, remarks, certificateNumber } = req.body;
    
    const updateData = {
      status,
      processedBy: 'Administrator', // In real app, use req.session.user
      processedAt: new Date()
    };
    
    if (remarks) updateData.remarks = remarks;
    if (certificateNumber) updateData.certificateNumber = certificateNumber;
    
    await Application.findByIdAndUpdate(req.params.id, updateData);
    
    res.redirect(`/admin/applications/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to update application'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

module.exports = router;