const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadFile, deleteFile } = require('../utils/imagekit');
const Application = require('../models/Application');

// Configure multer for memory storage (ImageKit needs buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
        const extname = allowedTypes.test(file.originalname.toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOC, DOCX are allowed.'));
        }
    }
});

// Upload documents for application
router.post('/documents/:applicationId', upload.array('documents', 10), async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { documentTypes } = req.body; // Array of document types corresponding to files
        
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        const uploadedDocuments = [];
        const errors = [];

        // Upload each file to ImageKit
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const documentType = Array.isArray(documentTypes) ? documentTypes[i] : documentTypes;
            
            const fileName = `${application.type}_${applicationId}_${documentType}_${Date.now()}`;
            const folder = `applications/${application.type}/${applicationId}`;
            
            const uploadResult = await uploadFile(file, fileName, folder);
            
            if (uploadResult.success) {
                uploadedDocuments.push({
                    fileId: uploadResult.data.fileId,
                    fileName: uploadResult.data.fileName,
                    originalName: file.originalname,
                    url: uploadResult.data.url,
                    thumbnailUrl: uploadResult.data.thumbnailUrl,
                    size: uploadResult.data.size,
                    documentType: documentType
                });
            } else {
                errors.push({
                    fileName: file.originalname,
                    error: uploadResult.error
                });
            }
        }

        // Add uploaded documents to application
        if (uploadedDocuments.length > 0) {
            application.documents.push(...uploadedDocuments);
            await application.save();
        }

        res.json({
            success: true,
            message: `${uploadedDocuments.length} documents uploaded successfully`,
            uploadedDocuments,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Document upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload documents',
            error: error.message
        });
    }
});

// Delete document
router.delete('/documents/:applicationId/:documentId', async (req, res) => {
    try {
        const { applicationId, documentId } = req.params;
        
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const documentIndex = application.documents.findIndex(
            doc => doc._id.toString() === documentId
        );

        if (documentIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        const document = application.documents[documentIndex];
        
        // Delete from ImageKit
        const deleteResult = await deleteFile(document.fileId);
        
        if (deleteResult.success) {
            // Remove from application
            application.documents.splice(documentIndex, 1);
            await application.save();
            
            res.json({
                success: true,
                message: 'Document deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete document from storage'
            });
        }

    } catch (error) {
        console.error('Document delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete document',
            error: error.message
        });
    }
});

// Get application documents
router.get('/documents/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;
        
        const application = await Application.findById(applicationId).select('documents type');
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.json({
            success: true,
            documents: application.documents,
            applicationType: application.type
        });

    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get documents',
            error: error.message
        });
    }
});

module.exports = router;