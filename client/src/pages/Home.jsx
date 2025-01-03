import React, { useState } from 'react';
import Outing from '../components/Outing';
import Carousel from '../components/Carousel';
import Impact from '../components/Impact';
import Title from '../utils/Title';
import { TextBox } from '../utils/TextBox';
import { ArrowRight, FormatQuote } from '@mui/icons-material';
import Hero from '../components/Hero';
import { Modal, Button, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import DocViewer, { DocViewerRenderers } from 'react-doc-viewer';

// Path to the Word document
import aManCalledSunnySingh from '../assets/pdf.docx';

export default function Home() {
  // State to control the modal visibility
  const [open, setOpen] = useState(false);

  // Handle open and close modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Array of documents for DocViewer
  const docs = "https://docs.google.com/document/d/1lZJgsDDqi3F5bEuurpeNScFLemJuxPms3_gKA8VXQgw/preview";

  return (
    <>
      <Hero />
      <Carousel />
      <TextBox className='lg:px-20 px-4 py-20'>
        <p className='mb-4'>
          The Tons Valley Education Trust, also known as <b>Sunny's Amanat</b>, was founded in 2006 by Mr. Sunny Singh. Its primary objective is the upliftment of the girl child by providing assistance in computer literacy and English language to underprivileged children in the area. Since his passing in 2012, his son, Mr. Aditya Singh, has been carrying forward this vision with enthusiastic sincerity.
        </p>
        <p className='mb-4 lg:block hidden'>
          The Trust provides stationery, school bags, umbrellas in the monsoon; thermals, socks and woolens in winter. It has an enviable library of books and a full-fledged computer lab.
        </p>
        <a href='about/tons-trust' className='bg-clip-text bg-[#152b8a] text-transparent from-pink-500 to-red-500'>
          read more {">"}<ArrowRight color='#000' />
        </a>
      </TextBox>
      <Outing />
      <Impact className="bg-[#f1f1f1]" />
      <div className='lg:px-20 px-5'>
        <TextBox className='mt-5 mb-20' >
          <p className=''>
            <FormatQuote className='-mt-4' style={{ transform: "rotate(180deg)" }} />
            Though Sunny Singh died in December last year, his legacy Guniyal Gaon Education Centre for girls continues to flourish. His son Aditya Singh, a senior Delhi banker, is its president now. Zarine Bath has since been running the school with her usual aplomb.
            <FormatQuote className='-mt-4' />
          </p>
          <h1>Want to know how it all started?</h1>
          <Button onClick={handleOpen} className='text-sky-700'>
            Read Now
          </Button>
        </TextBox>
      </div>
      <Modal
        className='lg:mx-20 mx-5 outline-none'
        open={open}
        onClose={handleClose}
        aria-labelledby="document-viewer"
        aria-describedby="word-document-viewer"
      >
        {/* <IconButton>
          <Close/>
        </IconButton> */}
        <div className='bg-white' >

          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>

          <div style={{ padding: '20px', backgroundColor: '#fff', height: '90vh' }}>

            {/* <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> */}
            <iframe className='h-full w-full overflow-x-hidden' src={docs} frameborder="0"></iframe>
          </div>
        </div>
      </Modal>
    </>
  );
}
