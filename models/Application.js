const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['birth', 'death'],
    required: true
  },
  applicantDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    fatherName: {
      type: String,
      required: true,
      trim: true
    },
    motherName: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    relationToSubject: {
      type: String,
      required: true
    }
  },
  subjectDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    },
    dateOfEvent: {
      type: Date,
      required: true
    },
    placeOfEvent: {
      type: String,
      required: true
    },
    fatherName: {
      type: String,
      required: true,
      trim: true
    },
    motherName: {
      type: String,
      required: true,
      trim: true
    },
    // Birth specific fields
    timeOfBirth: {
      type: String
    },
    weight: {
      type: String
    },
    hospitalName: {
      type: String
    },
    doctorName: {
      type: String
    },
    // Death specific fields
    causeOfDeath: {
      type: String
    },
    ageAtDeath: {
      type: String
    },
    occupation: {
      type: String
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed']
    }
  },
  documents: [{
    fileId: String, // ImageKit file ID
    fileName: String,
    originalName: String,
    url: String,
    thumbnailUrl: String,
    size: Number,
    documentType: {
      type: String,
      enum: [
        // Birth certificate documents
        'hospital_birth_certificate',
        'hospital_discharge_summary',
        'parent_aadhar_father',
        'parent_aadhar_mother',
        'parent_marriage_certificate',
        'parent_address_proof',
        'affidavit_delayed_registration',
        // Death certificate documents
        'medical_certificate_death',
        'hospital_discharge_summary_death',
        'deceased_aadhar',
        'applicant_aadhar',
        'relationship_proof',
        'police_report_unnatural_death',
        'other'
      ],
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  applicationNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  currentStage: {
    type: String,
    enum: ['submitted', 'document-verification', 'field-verification', 'approval', 'certificate-generation', 'completed'],
    default: 'submitted'
  },
  stageHistory: [{
    stage: {
      type: String,
      enum: ['submitted', 'document-verification', 'field-verification', 'approval', 'certificate-generation', 'completed']
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed', 'failed']
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    remarks: String,
    processedBy: String,
    documents: [{
      fileId: String,
      fileName: String,
      originalName: String,
      url: String,
      documentType: String
    }]
  }],
  remarks: {
    type: String
  },
  processedBy: {
    type: String
  },
  processedAt: {
    type: Date
  },
  certificateNumber: {
    type: String
  },
  estimatedCompletionDate: {
    type: Date
  },
  priority: {
    type: String,
    enum: ['normal', 'urgent', 'super-urgent'],
    default: 'normal'
  }
}, {
  timestamps: true
});

// Generate application number before saving
applicationSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const prefix = this.type === 'birth' ? 'BC' : 'DC';
    const year = new Date().getFullYear();
    const count = await mongoose.model('Application').countDocuments({
      type: this.type,
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    });
    this.applicationNumber = `${prefix}${year}${String(count + 1).padStart(4, '0')}`;
  }
  
  // Initialize stage history if it doesn't exist
  if (!this.stageHistory || this.stageHistory.length === 0) {
    this.stageHistory = [{
      stage: 'submitted',
      status: 'completed',
      startedAt: new Date(),
      completedAt: new Date(),
      remarks: 'Application submitted successfully',
      processedBy: 'System'
    }];
  }
  
  next();
});

applicationSchema.index({ applicationNumber: 1 });
applicationSchema.index({ type: 1, status: 1 });
applicationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);