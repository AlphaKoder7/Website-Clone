const mongoose = require('mongoose');
const Notice = require('../models/Notice');
const Service = require('../models/Service');
const Contact = require('../models/Contact');
const Application = require('../models/Application');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample data
const sampleNotices = [
  {
    title: "Tender Notice for Road Construction Work",
    content: "Pune Cantonment Board invites sealed tenders for the construction and maintenance of roads in various sectors. The work includes laying of new roads, repair of existing roads, and installation of street lights. Interested contractors with valid licenses and experience in similar projects are invited to submit their bids.",
    category: "tender",
    priority: "high",
    publishDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true
  },
  {
    title: "Water Supply Disruption Notice",
    content: "Due to maintenance work on the main water pipeline, water supply will be disrupted in Sectors 1-5 on Sunday from 6:00 AM to 6:00 PM. Residents are advised to store adequate water for the day. Emergency water tankers will be available at designated points.",
    category: "notification",
    priority: "urgent",
    publishDate: new Date(),
    isActive: true
  },
  {
    title: "Property Tax Payment Deadline Extended",
    content: "The deadline for property tax payment for the financial year 2024-25 has been extended to March 31, 2025. Property owners can pay their taxes online through the official website or visit the Cantonment Board office during working hours.",
    category: "announcement",
    priority: "medium",
    publishDate: new Date(),
    isActive: true
  },
  {
    title: "Recruitment for Various Posts",
    content: "Pune Cantonment Board announces recruitment for the following posts: Junior Engineer (2 posts), Accountant (1 post), Health Inspector (1 post), and Clerk (3 posts). Eligible candidates can apply online through the official website. Last date for application submission is February 28, 2025.",
    category: "recruitment",
    priority: "high",
    publishDate: new Date(),
    expiryDate: new Date('2025-02-28'),
    isActive: true
  },
  {
    title: "Solid Waste Management Guidelines",
    content: "New guidelines for solid waste management have been implemented. Residents are required to segregate waste into biodegradable and non-biodegradable categories. Collection timings have been revised. Wet waste: 7:00-9:00 AM, Dry waste: 3:00-5:00 PM.",
    category: "circular",
    priority: "medium",
    publishDate: new Date(),
    isActive: true
  }
];

const sampleServices = [
  {
    name: "Birth Certificate",
    description: "Apply for birth certificate registration and obtain certified copies of birth certificates.",
    category: "administration",
    requirements: [
      "Hospital discharge summary or birth certificate from hospital",
      "Parents' identity proof (Aadhar/Passport/Driving License)",
      "Parents' address proof",
      "Marriage certificate of parents (if applicable)"
    ],
    procedure: [
      { step: 1, description: "Fill the application form online or offline" },
      { step: 2, description: "Submit required documents" },
      { step: 3, description: "Pay the prescribed fee" },
      { step: 4, description: "Collect the certificate after verification" }
    ],
    fees: { amount: 50, currency: "INR" },
    processingTime: "7-10 working days",
    contactPerson: {
      name: "Mr. Registrar",
      designation: "Birth & Death Registrar",
      phone: "+91-20-26331394",
      email: "registrar@pune.cantt.gov.in"
    },
    isActive: true
  },
  {
    name: "Trade License",
    description: "Obtain trade license for starting a business within the cantonment area.",
    category: "administration",
    requirements: [
      "Completed application form",
      "Identity proof of applicant",
      "Address proof of business premises",
      "NOC from fire department (if applicable)",
      "Pollution clearance certificate (if applicable)"
    ],
    procedure: [
      { step: 1, description: "Submit application with required documents" },
      { step: 2, description: "Site inspection by officials" },
      { step: 3, description: "Pay license fee" },
      { step: 4, description: "Collect trade license" }
    ],
    fees: { amount: 1000, currency: "INR" },
    processingTime: "15-20 working days",
    contactPerson: {
      name: "Mr. License Officer",
      designation: "Licensing Officer",
      phone: "+91-20-26331395",
      email: "license@pune.cantt.gov.in"
    },
    isActive: true
  },
  {
    name: "Health Services",
    description: "Comprehensive healthcare services including OPD, emergency care, and preventive health programs.",
    category: "health",
    requirements: [
      "Valid ID proof",
      "Previous medical records (if any)",
      "Referral letter (for specialist consultation)"
    ],
    procedure: [
      { step: 1, description: "Register at the reception" },
      { step: 2, description: "Consultation with doctor" },
      { step: 3, description: "Diagnostic tests (if required)" },
      { step: 4, description: "Treatment/medication" }
    ],
    fees: { amount: 20, currency: "INR" },
    processingTime: "Same day",
    contactPerson: {
      name: "Dr. Health Officer",
      designation: "Chief Medical Officer",
      phone: "+91-20-26331396",
      email: "health@pune.cantt.gov.in"
    },
    isActive: true
  },
  {
    name: "Building Plan Approval",
    description: "Get approval for new construction, renovation, or modification of existing buildings.",
    category: "infrastructure",
    requirements: [
      "Building plan drawn by licensed architect",
      "Site plan and survey number",
      "Ownership documents",
      "NOC from relevant authorities",
      "Structural design (for multi-story buildings)"
    ],
    procedure: [
      { step: 1, description: "Submit application with plans and documents" },
      { step: 2, description: "Technical scrutiny by engineering department" },
      { step: 3, description: "Site inspection" },
      { step: 4, description: "Approval and issuance of permit" }
    ],
    fees: { amount: 5000, currency: "INR" },
    processingTime: "30-45 working days",
    contactPerson: {
      name: "Mr. Executive Engineer",
      designation: "Executive Engineer",
      phone: "+91-20-26331397",
      email: "engineer@pune.cantt.gov.in"
    },
    isActive: true
  },
  {
    name: "School Admission",
    description: "Admission process for Cantonment Board schools from nursery to 12th standard.",
    category: "education",
    requirements: [
      "Birth certificate of child",
      "Previous school leaving certificate (if applicable)",
      "Parents' identity and address proof",
      "Passport size photographs",
      "Medical fitness certificate"
    ],
    procedure: [
      { step: 1, description: "Fill admission form" },
      { step: 2, description: "Submit required documents" },
      { step: 3, description: "Entrance test/interview (if applicable)" },
      { step: 4, description: "Fee payment and admission confirmation" }
    ],
    fees: { amount: 500, currency: "INR" },
    processingTime: "During admission season",
    contactPerson: {
      name: "Ms. Education Officer",
      designation: "Education Officer",
      phone: "+91-20-26331398",
      email: "education@pune.cantt.gov.in"
    },
    isActive: true
  },
  {
    name: "Water Connection",
    description: "Apply for new water connection or modification of existing water connection.",
    category: "utilities",
    requirements: [
      "Property ownership documents",
      "Identity proof of applicant",
      "Site plan showing water connection point",
      "NOC from society (if applicable)",
      "Plumbing estimate from licensed plumber"
    ],
    procedure: [
      { step: 1, description: "Submit application with documents" },
      { step: 2, description: "Site survey by technical team" },
      { step: 3, description: "Pay connection charges" },
      { step: 4, description: "Installation of water meter and connection" }
    ],
    fees: { amount: 2500, currency: "INR" },
    processingTime: "10-15 working days",
    contactPerson: {
      name: "Mr. Water Superintendent",
      designation: "Water Supply Officer",
      phone: "+91-20-26331399",
      email: "water@pune.cantt.gov.in"
    },
    isActive: true
  }
];

const sampleContacts = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91-9876543210",
    subject: "Street Light Not Working",
    message: "The street light near my house in Sector 3 has not been working for the past week. Please arrange for repair.",
    department: "engineering",
    status: "pending"
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91-9876543211",
    subject: "Garbage Collection Issue",
    message: "Garbage collection in our area has been irregular. Please ensure regular pickup as per schedule.",
    department: "health",
    status: "in-progress"
  },
  {
    name: "Amit Patel",
    email: "amit.patel@email.com",
    phone: "+91-9876543212",
    subject: "Water Quality Complaint",
    message: "The water supplied to our area has been muddy and has an odd smell. Please check the quality.",
    department: "engineering",
    status: "resolved",
    response: "Water quality has been tested and found to be within acceptable limits. The issue was due to pipeline maintenance which has been completed.",
    respondedBy: "Water Quality Officer",
    respondedAt: new Date()
  }
];

const sampleApplications = [
  {
    type: 'birth',
    applicantDetails: {
      name: 'Rajesh Kumar',
      fatherName: 'Suresh Kumar',
      motherName: 'Sunita Kumar',
      address: 'Sector 5, Pune Cantonment',
      phone: '9876543210',
      email: 'rajesh.kumar@email.com',
      relationToSubject: 'father'
    },
    subjectDetails: {
      name: 'Arjun Kumar',
      gender: 'male',
      dateOfEvent: new Date('2024-01-15'),
      placeOfEvent: 'Command Hospital, Pune',
      fatherName: 'Rajesh Kumar',
      motherName: 'Priya Kumar',
      timeOfBirth: '10:30',
      weight: '3.2',
      hospitalName: 'Command Hospital',
      doctorName: 'Dr. Sharma'
    },
    applicationNumber: 'BC20240001',
    status: 'completed',
    certificateNumber: 'BC/2024/001'
  },
  {
    type: 'death',
    applicantDetails: {
      name: 'Meera Sharma',
      fatherName: 'Ram Sharma',
      motherName: 'Sita Sharma',
      address: 'Sector 3, Pune Cantonment',
      phone: '9876543211',
      email: 'meera.sharma@email.com',
      relationToSubject: 'daughter'
    },
    subjectDetails: {
      name: 'Mohan Sharma',
      gender: 'male',
      dateOfEvent: new Date('2024-02-10'),
      placeOfEvent: 'Home, Pune Cantonment',
      fatherName: 'Gopal Sharma',
      motherName: 'Radha Sharma',
      causeOfDeath: 'Natural causes',
      ageAtDeath: '75 years',
      occupation: 'Retired Teacher',
      maritalStatus: 'married'
    },
    applicationNumber: 'DC20240001',
    status: 'under-review'
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Notice.deleteMany({});
    await Service.deleteMany({});
    await Contact.deleteMany({});
    await Application.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Insert sample data
    await Notice.insertMany(sampleNotices);
    console.log('Inserted sample notices');
    
    await Service.insertMany(sampleServices);
    console.log('Inserted sample services');
    
    await Contact.insertMany(sampleContacts);
    console.log('Inserted sample contacts');
    
    await Application.insertMany(sampleApplications);
    console.log('Inserted sample applications');
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedDatabase();