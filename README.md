# Pune Cantonment Board Website Clone

A full-stack web application that clones the Pune Cantonment Board website with modern features and functionality.

## Features

- **Frontend**: Responsive design with Bootstrap 5, EJS templating
- **Backend**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Admin Panel**: Complete admin interface for content management
- **Forms**: Contact forms, service applications
- **File Upload**: Support for document attachments
- **Search**: Full-text search functionality
- **API**: RESTful API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS, Bootstrap 5, Font Awesome
- **File Upload**: Multer
- **Session Management**: Express-session
- **Security**: Helmet, CORS, Rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pune-cantonment-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pune_cantonment
   SESSION_SECRET=your_session_secret_here
   NODE_ENV=development
   
   # ImageKit Configuration (for document storage)
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
   ```

4. **Set up ImageKit** (for document storage)
   - Sign up at [ImageKit.io](https://imagekit.io)
   - Get your Public Key, Private Key, and URL Endpoint
   - Add them to your `.env` file

5. **Start MongoDB**
   Make sure MongoDB is running on your system.

6. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

7. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

8. **Access the application**
   - Website: http://localhost:3002
   - Admin Panel: http://localhost:3002/admin/login
   - Test admin credentials:
     - `admin` / `password`
     - `pcb_admin` / `123456`
     - `test` / `test123`

## Project Structure

```
├── models/              # MongoDB models
│   ├── Notice.js
│   ├── Contact.js
│   └── Service.js
├── routes/              # Express routes
│   ├── index.js         # Main website routes
│   ├── admin.js         # Admin panel routes
│   └── api.js           # API endpoints
├── views/               # EJS templates
│   ├── partials/        # Reusable components
│   ├── admin/           # Admin panel views
│   └── *.ejs            # Page templates
├── public/              # Static assets
│   ├── css/
│   ├── js/
│   ├── images/
│   └── uploads/         # File uploads
├── scripts/             # Utility scripts
│   └── seed.js          # Database seeding
├── server.js            # Main application file
└── package.json
```

## Key Features

### Document Management
- **ImageKit Integration**: Secure cloud storage for all documents
- **Document Types**: Support for birth/death certificate requirements
- **File Validation**: Automatic validation of file types and sizes
- **Thumbnail Generation**: Automatic thumbnail creation for images
- **Secure Access**: Protected document URLs with access control

### Application System
- **Birth Certificates**: Complete online application with required documents
- **Death Certificates**: Comprehensive death certificate application
- **Document Requirements**: Specific document types for each application
- **Status Tracking**: Real-time application status updates
- **Admin Review**: Complete admin workflow for application processing

### Public Website
- **Homepage**: Hero section, quick services, latest notices
- **About**: Information about Pune Cantonment Board
- **Services**: Detailed service information with requirements and procedures
- **Notices**: Paginated notices with search and filtering
- **Tenders**: Active tenders with document downloads
- **Contact**: Contact form with department-wise routing
- **Birth Certificate Application**: Online form with document upload
- **Death Certificate Application**: Online form with document upload
- **Application Status Check**: Track application progress

### Admin Panel
- **Dashboard**: Statistics and quick actions for all modules
- **Notice Management**: Create, edit, delete notices with file attachments
- **Application Management**: Review birth/death certificate applications
- **Document Viewer**: View uploaded documents via ImageKit
- **Status Management**: Approve/reject applications with remarks
- **Contact Management**: View and respond to citizen queries
- **Service Management**: Manage service information

### API Endpoints
- `GET /api/notices` - Get all notices
- `GET /api/notices/:id` - Get single notice
- `GET /api/services` - Get all services
- `POST /api/contact` - Submit contact form
- `GET /api/search` - Search notices

## Database Models

### Notice
- Title, content, category, priority
- Publish date, expiry date
- File attachments
- View count, active status

### Service
- Name, description, category
- Requirements, procedure steps
- Fees, processing time
- Contact person details

### Contact
- User details (name, email, phone)
- Subject, message, department
- Status tracking, admin responses

## Security Features

- Helmet for security headers
- CORS protection
- Rate limiting
- Input validation
- File upload restrictions
- Session management

## Responsive Design

- Mobile-first approach
- Bootstrap 5 grid system
- Touch-friendly interface
- Optimized for all screen sizes

## Development

### Adding New Features
1. Create/modify models in `models/`
2. Add routes in `routes/`
3. Create views in `views/`
4. Update styles in `public/css/`
5. Add client-side JS in `public/js/`

### Database Seeding
The seed script creates sample data for development:
```bash
npm run seed
```

### File Uploads
Files are stored in `public/uploads/` with unique names.
Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF

## Deployment

### Environment Setup
- Set `NODE_ENV=production`
- Use a production MongoDB instance
- Configure proper session secrets
- Set up HTTPS in production

### Recommended Hosting
- **Backend**: Heroku, DigitalOcean, AWS
- **Database**: MongoDB Atlas
- **Files**: AWS S3 (for production file storage)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Contact: [your-email@example.com]

## Acknowledgments

- Original website: https://pune.cantt.gov.in
- Bootstrap 5 for responsive design
- Font Awesome for icons
- MongoDB for database
- Express.js community