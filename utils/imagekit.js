const ImageKit = require('imagekit');

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Upload file to ImageKit
const uploadFile = async (file, fileName, folder = 'documents') => {
    try {
        const result = await imagekit.upload({
            file: file.buffer,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: true,
            tags: ['pune-cantonment', 'application-document']
        });
        
        return {
            success: true,
            data: {
                fileId: result.fileId,
                fileName: result.name,
                url: result.url,
                thumbnailUrl: result.thumbnailUrl,
                size: result.size
            }
        };
    } catch (error) {
        console.error('ImageKit upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Delete file from ImageKit
const deleteFile = async (fileId) => {
    try {
        await imagekit.deleteFile(fileId);
        return { success: true };
    } catch (error) {
        console.error('ImageKit delete error:', error);
        return { success: false, error: error.message };
    }
};

// Get file details
const getFileDetails = async (fileId) => {
    try {
        const result = await imagekit.getFileDetails(fileId);
        return { success: true, data: result };
    } catch (error) {
        console.error('ImageKit get file error:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    imagekit,
    uploadFile,
    deleteFile,
    getFileDetails
};