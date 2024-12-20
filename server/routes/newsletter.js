const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/image'); // Adjust the path as necessary for your Image model
const Newsletter = require('../models/newsletter');
// Create uploads directory if it doesn't exist
cloudinary.config({
    cloud_name: "drzyrq7d5",   
    api_key: "585179992638461",   
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

// Route for uploading PDFs
router.post('/newsletters', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { title } = req.body; // Get the 'title' from request body
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    const newPDF = new Newsletter({ title, documentLink: pdfUrl }); // Assuming you have a Newsletter model

    try {
        await newPDF.save();
        res.status(200).json({ message: 'PDF uploaded successfully', pdfUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error saving PDF', error });
    }
});

// Get all newsletters (GET)
router.get('/newsletters', async (req, res) => {
    try {
        const newsletters = await Newsletter.find();
        res.status(200).json(newsletters);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching newsletters', error: error.message });
    }
});

// Get a single newsletter by ID (GET)
router.get('/newsletters/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const newsletter = await Newsletter.findById(id);
        if (!newsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json(newsletter);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching newsletter', error: error.message });
    }
});

// Update a newsletter by ID (PUT)
router.put('/newsletters/:id', upload.single('document'), async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const documentLink = req.file ? req.file.path : null;

    try {
        const updatedNewsletter = await Newsletter.findByIdAndUpdate(
            id,
            { title, documentLink: documentLink || undefined, uploadedAt: Date.now() },
            { new: true } // return the updated document
        );
        if (!updatedNewsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json({ message: 'Newsletter updated successfully!', newsletter: updatedNewsletter });
    } catch (error) {
        res.status(400).json({ message: 'Error updating newsletter', error: error.message });
    }
});

// Delete a newsletter by ID (DELETE)
router.delete('/newsletters/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedNewsletter = await Newsletter.findByIdAndDelete(id);
        if (!deletedNewsletter) {
            return res.status(404).json({ message: 'Newsletter not found' });
        }
        res.status(200).json({ message: 'Newsletter deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting newsletter', error: error.message });
    }
});


router.get('/get/news',async (req,res) => {
    const f = await  Newsletter.find();
    res.json(f);
})

module.exports = router;
