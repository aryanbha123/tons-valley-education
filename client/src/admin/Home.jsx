import React from 'react';
import Navbar from './Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'; // For navigation

export default function AdminDashboard() {
  const navigate = useNavigate(); // Initialize navigate for routing

  // Function to trigger the popup for contact developer access
  const showContactDeveloperPopup = () => {
    toast.info('Contact Developer for Access', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  // Function to navigate to the donation page
  const navigateToDonationPage = () => {
    navigate('/admin/donations'); // Change this to the correct path for your donation page
  };

  // Function to navigate to the newsletters management page
  const navigateToNewsletterPage = () => {
    navigate('/admin/newsletters'); // Change this to the correct path for your newsletters page
  };
  const navigateToGalleryPage = () => {
    navigate('/admin/gallery'); // Change this to the correct path for your newsletters page
  };

  

  return (
    <>
      <Navbar />

      {/* Admin Panel Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8">
        <div 
          className="border p-6 bg-gray-100 rounded-lg shadow-lg flex flex-col justify-between"
          onClick={navigateToGalleryPage} 
        >
          <h2 className="text-xl font-semibold text-gray-800">Manage Gallery</h2>
          <p className="mt-4 text-gray-600">Upload, edit, or delete gallery images for the website.</p>
          <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
            Manage Gallery
          </button>
        </div>

        {/* 2nd Div - Text Content Management */}
      

        {/* 5th Div - Manage Newsletters Section */}
        <div 
          className="border p-6 bg-green-100 text-green-700 rounded-lg shadow-lg flex flex-col justify-between"
          onClick={navigateToNewsletterPage} // Navigate to the newsletters page on click
        >
          <h2 className="text-xl font-semibold">Manage Newsletters</h2>
          <p className="mt-4">Create, edit, or delete newsletters for subscribers.</p>
          <button 
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
            Manage Newsletters
          </button>
        </div>

      </div>

      {/* ToastContainer for Popup Notifications */}
      <ToastContainer />
    </>
  );
}
