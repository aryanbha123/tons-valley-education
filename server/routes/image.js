const router = require('express').Router();
const Image = require('../models/image');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: "drzyrq7d5",    // Your Cloudinary cloud name
    api_key: "585179992638461",    // Your Cloudinary API key
    api_secret: "3r7NuV7KipN0JTbtzfn4hEpGcOs", // Your Cloudinary API secret
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Optional folder to store images
        allowed_formats: ['jpg', 'jpeg', 'png', '.pdf'], // Allowed file formats
    },
});

const upload = multer({ storage });

export { upload };
// Route for uploading an image
router.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { type } = req.body; // Get the 'type' from request body
    if (!type || !['Students', 'Classroom', 'Outing', 'Staff', 'Others'].includes(type)) {
        return res.status(400).json({ message: 'Invalid image type' });
    }

    try {
        const imageUrl = req.file.path; // Cloudinary URL of the uploaded image
        const newImage = new Image({ url: imageUrl, type });
        await newImage.save();

        res.status(200).json({ message: 'Image uploaded successfully', imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error saving image', error });
    }
});

// Route to get all images
router.get('/get/images', async (req, res) => {
    try {
        const img = await Image.find();
        res.status(200).json({ img });
    } catch (error) {
        res.status(400).json({ error });
    }
});

// Route to delete an image
router.post('/delete/img/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const img = await Image.findByIdAndDelete(id);
        if (!img) {
            return res.status(404).json({ success: false, msg: "Image not found" });
        }

        // Extract the public_id from the Cloudinary URL to delete the image from Cloudinary
        const publicId = img.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);

        res.status(200).json({ success: true, msg: "Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ success: false, err: "Server Error" });
    }
});

module.exports = router;
