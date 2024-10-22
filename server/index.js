const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3001;

const URI = "mongodb+srv://aryan:Aryan123@cluster0.ym6ob.mongodb.net/tonsvalley?retryWrites=true&w=majority&appName=Cluster0"
app.use(cookieParser());
const allowedOrigins = ['https://www.tonsvalleyeducationtrust.org'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};




app.use(express.json());
app.use(cors(corsOptions));

app.use(require('./routes/userRoutes'));
app.use(require('./routes/auth'));
app.use(express.static('uploads'));
app.use(require('./routes/image'));
app.use(require('./routes/newsletter'));
// Basic test route
app.get('/', (req, res) => {
    res.send("Server Live");
});

// Donation request handling route with email notification
app.post('/api/donation', async (req, res) => {
    const { name, phone, visit } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'aryanbhandari4077@gmail.com',
            pass: 'pijr hbnz zuhf lbvz', // Don't expose sensitive credentials in production!
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: 'aryanbhandari4077@gmail.com',
        to: '99sunnysingh@gmail.com',
        subject: 'New Donation Request',
        text: `Donation details:
        Name: ${name}
        Phone: ${phone}
        Visit preference: ${visit === 'yes' ? 'Scheduled Visit' : 'No Visit'}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send({ message: 'Donation email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ message: 'Failed to send donation email.' });
    }
});

// MongoDB connection
mongoose.connect(URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
