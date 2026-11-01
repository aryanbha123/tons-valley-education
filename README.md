# Tons Valley Education Trust Website

A full-stack website with an admin panel for Tons Valley Education Trust, an education trust in Dehradun.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Live site:** [tonsvalleyeducationtrust.org](https://tonsvalleyeducationtrust.org)

## About

This is a client project built for Tons Valley Education Trust. The public site tells the trust's story, shows its students, team, impact and outings, and lets visitors make a donation request. Trust staff log in to an admin panel to manage the photo gallery and upload newsletters, which are stored on Cloudinary and listed on the public site.

## Features

**Public site**
- Home, About, Donations, Gallery and Stories pages with lazy loading and a loader
- Hero, carousel, slider, team, impact and outing sections
- Donation form: `POST /api/donation` emails the request (name, phone, visit preference) to the trust
- Gallery filtered by category (Students, Classroom, Outing, Staff, Others) with image modals
- Newsletter list with in-browser document viewing
- `sitemap.xml` and `robots.txt` for SEO

**Admin panel** (`/admin`, behind a protected route)
- JWT login with an HTTP-only cookie, logout and an auth context
- Forgot-password flow: emails a reset link with a 5-minute token
- Upload, crop (react-easy-crop) and delete gallery images
- Create, edit and delete newsletters (PDF/document uploads)

## Tech Stack

- **Frontend:** React 18 (Create React App), React Router 6, Tailwind CSS 3, MUI 5, Framer Motion, styled-components, Axios, react-dropzone, react-easy-crop, react-doc-viewer, react-hot-toast, react-toastify
- **Backend:** Node.js, Express 4, MongoDB with Mongoose, JWT, bcryptjs, cookie-parser, Multer with Cloudinary storage, Nodemailer
- **Hosting:** Vercel (backend `vercel.json`)

## Project Structure

```
.
├── client/
│   ├── public/            # index.html, manifest, sitemap.xml, robots.txt
│   └── src/
│       ├── App.jsx        # Routes
│       ├── AuthContext.jsx
│       ├── pages/         # Home, About, Donations, Gallery, Stories, NotFound
│       ├── admin/         # Login, reset password, dashboard, gallery, newsletters, donations
│       ├── components/    # Hero, Carousel, Slider, Team, Impact, Outing, DonationModal
│       ├── layout/        # Header, Footer, Layout
│       ├── hooks/ProtectRoute.jsx
│       └── data/          # Student data and photos
└── server/
    ├── index.js           # Express app, CORS, donation mail route
    ├── routes/            # userRoutes, auth, image, newsletter
    ├── models/            # user, image, newsletter
    ├── middlewares/authCheck.js
    └── vercel.json
```

## Getting Started

Prerequisites: Node.js, npm, a MongoDB database, a Cloudinary account and a Gmail app password.

### Backend

```bash
cd server
npm install
npm run dev        # nodemon index.js, port 3001 by default
```

Environment variables read by the server: `PORT`, `JWT_SECRET`, `NODE_ENV`. The MongoDB URI, Cloudinary settings and mail credentials are currently set inside the source files (`index.js`, `routes/image.js`, `routes/newsletter.js`, `routes/userRoutes.js`) and should be moved to environment variables before reuse.

### Frontend

```bash
cd client
npm install
npm start
```

The API base URL is set in `client/src/AuthContext.jsx`.

## API Endpoints

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/` | Health check |
| `POST` | `/register` | Create an admin user |
| `POST` | `/login` | Log in, sets a JWT cookie |
| `POST` | `/logout` | Clear the auth cookie |
| `POST` | `/forgot-password` | Email a password-reset link |
| `POST` | `/reset-password/:token` | Reset the password |
| `GET` | `/get/user` | Current user (auth required) |
| `POST` | `/upload` | Upload a gallery image |
| `GET` | `/get/images` | List gallery images |
| `POST` | `/delete/img/:id` | Delete a gallery image |
| `POST` | `/newsletters` | Upload a newsletter |
| `GET` | `/newsletters` | List newsletters |
| `GET` | `/newsletters/:id` | Get a newsletter |
| `PUT` | `/newsletters/:id` | Update a newsletter |
| `DELETE` | `/newsletters/:id` | Delete a newsletter |
| `GET` | `/get/news` | Public newsletter list |
| `POST` | `/api/donation` | Send a donation request email |

## Author

**Aryan Bhandari**: [GitHub](https://github.com/aryanbha123)
