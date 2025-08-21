const express = require('express');
const router = express.Router();
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
    // Application statistics
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const birthApplications = await Application.countDocuments({ type: 'birth' });
    const deathApplications = await Application.countDocuments({ type: 'death' });
    
    // Stage-based statistics
    const submittedApps = await Application.countDocuments({ currentStage: 'submitted' });
    const documentVerificationApps = await Application.countDocuments({ currentStage: 'document-verification' });
    const fieldVerificationApps = await Application.countDocuments({ currentStage: 'field-verification' });
    const approvalApps = await Application.countDocuments({ currentStage: 'approval' });
    const certificateGenerationApps = await Application.countDocuments({ currentStage: 'certificate-generation' });
    const completedApps = await Application.countDocuments({ currentStage: 'completed' });

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: {
        totalApplications,
        pendingApplications,
        birthApplications,
        deathApplications,
        submittedApps,
        documentVerificationApps,
        fieldVerificationApps,
        approvalApps,
        certificateGenerationApps,
        completedApps
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

// Stage-based application management
router.get('/applications', requireAuth, async (req, res) => {
  try {
    const { type, status, currentStage } = req.query;
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (currentStage) query.currentStage = currentStage;
    
    const applications = await Application.find(query).sort({ createdAt: -1 });
    
    res.render('admin/applications', {
      title: 'Manage Applications',
      applications,
      currentType: type,
      currentStatus: status,
      currentStage: currentStage
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Unable to load applications'
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

// Update application stage and status
router.post('/applications/:id/stage', requireAuth, async (req, res) => {
  try {
    const { currentStage, status, remarks, certificateNumber, estimatedCompletionDate, priority } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    // Add current stage to history
    const stageHistoryEntry = {
      stage: application.currentStage,
      status: 'completed',
      startedAt: application.stageHistory.find(h => h.stage === application.currentStage)?.startedAt || new Date(),
      completedAt: new Date(),
      remarks: remarks || `Moved from ${application.currentStage} to ${currentStage}`,
      processedBy: 'Administrator'
    };
    
    // Add new stage to history
    const newStageEntry = {
      stage: currentStage,
      status: 'in-progress',
      startedAt: new Date(),
      remarks: remarks || `Stage started`,
      processedBy: 'Administrator'
    };
    
    const updateData = {
      currentStage,
      status: status || application.status,
      processedBy: 'Administrator',
      processedAt: new Date(),
      $push: { stageHistory: [stageHistoryEntry, newStageEntry] }
    };
    
    if (remarks) updateData.remarks = remarks;
    if (certificateNumber) updateData.certificateNumber = certificateNumber;
    if (estimatedCompletionDate) updateData.estimatedCompletionDate = estimatedCompletionDate;
    if (priority) updateData.priority = priority;
    
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