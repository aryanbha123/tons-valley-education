import React from 'react';
import {
  ArrowRight,
  Call, Facebook, Instagram, LinkedIn, MailOutline, Twitter, YouTube
} from '@mui/icons-material';
import { Divider, IconButton, TextField } from '@mui/material';
import { toast } from 'react-hot-toast';
import { useInputValidation, isValidEmail } from '6pp';
import { TextBox } from '../utils/TextBox';

export default function Footer() {
  const checkEmail = (email) => isValidEmail(email);

  const name = useInputValidation("");
  const email = useInputValidation("", checkEmail);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    const subscriptionData = {
      name: name.value,
      email: email.value,
    };

    toast.promise(
      fetch('https://pukaar-main-server.vercel.app/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscriptionData),
      }),
      {
        loading: 'Subscribing...',
        success: 'Subscribed successfully!',
        error: 'Subscription failed!',
      }
    ).then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch(error => console.error('Error:', error));
  };

  return (
    <footer className='flex flex-col lg:px-20 py-10 bg-[#f5f5f5] text-[#010101] px-4'>
      <div className='flex justify-between  items-start flex-col lg:flex-row lg:gap-0 gap-6'>
        <TextBox className='w-[90vw]'>
          <p className='text-start font-bold text-lg'>Tons Valley Education Trust</p>
          <p className='text-start'>Unit Guniyal Gaon Education Center</p>
          <p className='text-start'>A Charitable Institute for Girls</p>
          <br />
          <p className='text-start'>Guniyal Gaon, P.O .SINOLA, Dehradun 248003</p>
          <p className='text-start'>C-3, Maharani Bagh, NEW DELHI - 110065</p>
          <br />
          <div className='text-start'>Contact Us: Tel: +91 98110 29222 | Email: guniyaleducent@gmail.com</div>
        </TextBox>
        <TextBox className=' w-[80vw] lg:mb-0 mb-6'>
          <p className='text-start font-bold text-lg'>About Us</p>
          <p className='text-start' >Guniyal Gaon Girls Education Center is the unit of Tons Valley Education Trust also referred to as Sunny's Amanat.It is an educational trust focused on promoting the upliftment and empowerment of girl child through education.
</p>
          <p className='text-start text-indigo-500 cursor-pointer' onClick={()=>{window.location.href='/about/toons-trust'}}>Read More <ArrowRight/> </p>
        </TextBox>


        {/* <form onSubmit={handleSubscribe} className='flex flex-col gap-5'>
          <TextField
            className='text-[#010101] w-full lg:w-[380px]'
            required
            label="Email"
            value={email.value}
            onChange={email.changeHandler}
            type="email"
            variant="standard"
          />
          <TextField
            className='text-[#010101] w-full lg:w-[380px]'
            required
            label="Name"
            value={name.value}
            onChange={name.changeHandler}
            variant='standard'
          />
          <button
            id='subscribe-btn'
            type='submit'
            className="bg-gradient-to-r from-slate-200 to-slate-400 text-[#222] font-medium py-2 px-4 rounded"
          >
            Subscribe
          </button>
        </form> */}
      </div>

      <Divider className='my-7 bg-[#666]' />

      <div className="flex justify-between items-center flex-col lg:flex-row">
        <p className='text-[#010101] mb-2 lg:mb-0'>© 2024 Tons Valley Education Trust. All rights reserved. Design & developed by AP enterprises </p>
        <div className='flex gap-3'>
          <IconButton aria-label="email" className="text-[#010101]">
            <MailOutline />
          </IconButton>
          <IconButton aria-label="call" className="text-[#010101]">
            <Call />
          </IconButton>
        </div>
      </div>
    </footer>
  );
}
