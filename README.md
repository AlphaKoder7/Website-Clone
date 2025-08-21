# 🏛️ Pune Cantonment Board Website Clone

A full-stack web application that replicates the functionality of the Pune Cantonment Board government website with modern features, complete admin panel, and stage-based application processing system.

![Pune Cantonment Board](https://img.shields.io/badge/Government-Website%20Clone-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.5+-orange)
![Express](https://img.shields.io/badge/Express-4.18+-yellow)

## ✨ Features

### 🎯 **Core Functionality**
- **Public Website**: Homepage, services, notices, contact forms
- **Application System**: Birth/Death certificate applications with document uploads
- **Admin Panel**: Complete administrative interface for content management
- **Progress Tracking**: Stage-based application workflow system
- **Document Management**: Secure file upload and storage via ImageKit

### 🚀 **Application Progress Stages**
1. **Submitted** - Application received
2. **Document Verification** - Document review and validation
3. **Field Verification** - On-site verification process
4. **Approval** - Administrative approval
5. **Certificate Generation** - Document creation
6. **Completed** - Process finished

### 🔐 **Admin Features**
- **Dashboard**: Real-time statistics and progress tracking
- **Application Management**: Review and process applications by stage
- **Document Viewer**: Access uploaded documents
- **Status Updates**: Move applications through workflow stages
- **Progress Monitoring**: Track application completion rates

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Frontend** | EJS templating, Bootstrap 5 |
| **File Storage** | ImageKit integration |
| **Security** | Helmet, CORS, Rate limiting |
| **Authentication** | Session-based admin system |

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v7.5 or higher)
- **ImageKit Account** (for document storage)
- **Git** (for version control)

## 🚀 Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/AlphaKoder7/Website-Clone.git
cd Website-Clone
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
Create a `.env` file in the root directory:
```env
PORT=3002
MONGODB_URI=mongodb://localhost:27017/pune_cantonment
SESSION_SECRET=your_session_secret_here_12345
NODE_ENV=development

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### **4. Database Setup**
```bash
# Start MongoDB
mongod

# Seed the database (in another terminal)
npm run seed
```

### **5. Start the Application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🌐 Access URLs

- **Main Website**: http://localhost:3002
- **Admin Panel**: http://localhost:3002/admin/login
- **Admin Test Page**: http://localhost:3002/admin-test

## 🔑 Admin Credentials

| Username | Password | Description |
|----------|----------|-------------|
| `admin` | `password` | Main admin account |
| `pcb_admin` | `123456` | PCB specific admin |
| `test` | `test123` | Test account |

## 📁 Project Structure

```
Website-Clone/
├── models/              # MongoDB schemas
│   ├── Application.js   # Application model with stages
│   ├── Contact.js       # Contact form submissions
│   ├── Notice.js        # Government notices
│   └── Service.js       # Service information
├── routes/              # Express route handlers
│   ├── index.js         # Main website routes
│   ├── admin.js         # Admin panel routes
│   ├── api.js           # API endpoints
│   └── upload.js        # File upload handling
├── views/               # EJS templates
│   ├── admin/           # Admin panel views
│   ├── forms/           # Application forms
│   └── partials/        # Reusable components
├── public/              # Static assets
├── scripts/             # Database seeding
├── utils/               # ImageKit integration
└── server.js            # Main application file
```

## 🔄 Application Workflow

### **Stage 1: Submission**
- User fills application form
- Documents uploaded to ImageKit
- Application assigned unique number
- Status: `submitted`

### **Stage 2: Document Verification**
- Admin reviews uploaded documents
- Validates document authenticity
- Marks stage as complete
- Status: `document-verification`

### **Stage 3: Field Verification**
- On-site verification process
- Physical document checks
- Field officer reports
- Status: `field-verification`

### **Stage 4: Approval**
- Administrative review
- Final approval decision
- Certificate number assignment
- Status: `approval`

### **Stage 5: Certificate Generation**
- Generate official certificate
- Digital signature application
- Status: `certificate-generation`

### **Stage 6: Completion**
- Process finalized
- Certificate delivered
- Status: `completed`

## 📊 Dashboard Features

- **Real-time Statistics**: Application counts by stage
- **Progress Tracking**: Visual progress bars
- **Quick Actions**: Stage-specific filtering
- **Performance Metrics**: Processing time analysis

## 🔒 Security Features

- **Input Validation**: Form data sanitization
- **File Upload Security**: Type and size restrictions
- **Rate Limiting**: API abuse prevention
- **Session Management**: Secure admin authentication
- **CORS Protection**: Cross-origin request handling

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Bootstrap 5**: Modern component library
- **Font Awesome**: Professional iconography
- **Progress Indicators**: Visual workflow representation
- **Interactive Elements**: Hover effects and animations

## 🚀 Deployment

### **Local Development**
```bash
npm run dev
```

### **Production Deployment**
```bash
npm start
```

### **Environment Variables**
- Set `NODE_ENV=production`
- Configure production MongoDB
- Set up HTTPS certificates
- Configure ImageKit production keys

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Website**: [Pune Cantonment Board](https://pune.cantt.gov.in)
- **Bootstrap**: Responsive design framework
- **Font Awesome**: Icon library
- **MongoDB**: Database solution
- **Express.js**: Web framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

**⭐ Star this repository if you find it helpful!**

**🔗 Repository**: [https://github.com/AlphaKoder7/Website-Clone.git](https://github.com/AlphaKoder7/Website-Clone.git)