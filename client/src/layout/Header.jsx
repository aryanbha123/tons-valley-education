import React, { useEffect, useState } from 'react'
import img1 from '../assets/nav.png'
import logo from '../assets/logo.png'
import { styled } from 'styled-components'
import { ArrowDownward, ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Hamburger } from '../icons/Button';
import './Header.css';
import axios from 'axios'
import { useAuth } from '../AuthContext'
import { CircularProgress } from '@mui/material'
const Link = styled.a`
    font-family: raleway, Sans-serif;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    color:#666;
    cursor:pointer;
    
`;



export default function Header() {

    const [showNav, setShowNav] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [newsletters, setNewsletters] = useState([]);
    const {baseurl } = useAuth();
    const [loading,setLoading] = useState(true);
    useEffect(() => {
        const getNewsletters = async () => {
            try {
                const res = await axios.get(`${baseurl}/get/news`);
                setNewsletters(res.data); // Assuming the response data is the newsletters array
            } catch (error) {
                console.error('Error fetching newsletters:', error);
            }finally{
                setLoading(false);
            }
        };

        getNewsletters();
    }, []);


    return (
        <div className='relative z-[90] h-[100px] lg:h-[135.03px]'>
            <div className='fixed lg:flex hidden px-20 shadow-xl py-5 gap-10 w-full bg-white'>
                <div onClick={() => window.location.href = "/"} className="logo">
                    <img src={logo} height={"100px"} width={"100px"} alt="" />
                </div>
                <div className="flex items-end list-none   gap-7 pb-7">
                    <li><Link href='/'>Home</Link></li>
                    <li><Link href='/about/toons-trust'>About Us</Link></li>
                    <div className='flex flex-col items-center relative h-auto' onMouseEnter={() => setShowDropDown(true)} onMouseLeave={() => setShowDropDown(false)}>
                        <Link className='flex items-center'>Newsletters {
                            showDropDown ?
                                <>
                                    <ArrowDropUp className='' />
                                </>
                                :
                                <>
                                    <ArrowDropDown className='' />
                                </>
                        } </Link>
                        <div className={`${showDropDown ? 'absolute' : 'hidden'}  pt-[76px] w-36 top-0 list-none flex flex-col gap-2`}>
                            <div className={`bg-white px-5 py-3 w-36 top-[75px] items-center   list-none flex flex-col gap-2`}>
                                {/* <li onClick={() => { alert("Please Try again later") }} className='hover:text-gray-600 cursor-pointer '>Latest year</li> */}

                                {
                                    !loading ? 
                                    newsletters.map((item,id) => (
                                        <li key={id} onClick={() => { window.location.href = `${item.documentLink}`  }} className='hover:text-gray-600 cursor-pointer '>{item.title}</li>
                                    ))
                                    :
                                    <CircularProgress sx={{padding:1.4}} />
                                }
                            </div>
                        </div>
                    </div>
                    <li><Link href="/gallery" >Gallery</Link></li>
                    {/* <li><Link href="/stories">Stories</Link></li> */}
                    <li><Link href="/donations/make-a-change">Donations</Link></li>
                </div>
                <div className="absolute right-20 flex items-end gap-10">
                    <button onClick={() => { window.location.href = "/donations/make-a-change" }} className="bg-gradient-to-r h-8 donate-btn  mb-4   from-[#7c8fe6] to-[#152b8a] text-white font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-101">
                        Donate Now
                    </button>
                    <img className='ute' src={img1} height={"40px"} width={"50px"} alt="" />
                </div>
            </div>
            <div className='shadow-md lg:hidden z-[90] fixed  w-full top-0 bg-white flex justify-between px-4 items-center  py-3'>
                <div className="logo">
                    <img src={logo} height={"80px"} width={"80px"} alt="" />
                </div>
                <div className="btns">
                    <Hamburger showNav={showNav} setShowNav={setShowNav}  ></Hamburger>
                </div>
                <div className={`absolute  top-24 overflow-hidden bg-white w-full left-0 ${showNav ? 'showMenu' : 'hideMenu'}`}>
                    <div className={`flex flex-col items-center list-none  gap-7 py-9`}>
                        <li><Link href='/'>Home</Link></li>
                        <li><Link href="/about/toons-trust" className='text-black'>About Us</Link></li>
                        <li><Link onClick={() => setShowDropDown(!showDropDown)} className='text-black relative mr-2'>Newsletters {
                            showDropDown ?
                                <>
                                    <ArrowDropUp className='absolute' />
                                </> :
                                <>
                                    <ArrowDropDown className='absolute' />
                                </>
                        } </Link>
                            <ul className={`${showDropDown ? 'h-auto' : 'hidden'} overflow-hidden list-none flex flex-col items-center pt-2 gap-2`}>
                              
                            {
                                    !loading ? 
                                    newsletters.map((item,id) => (
                                        <li key={id} onClick={() => { window.location.href = `${item.documentLink}`  }} className='hover:text-gray-600 cursor-pointer '>{item.title}</li>
                                    ))
                                    :
                                    <CircularProgress sx={{padding:1.4}} />
                                }
                            </ul>
                        </li>

                        <li><Link href="/gallery" className='text-black'>Gallery</Link></li>
                        {/* <li><Link href="/stories" className='text-black'>Stories</Link></li> */}
                        <li><Link href='/donations/make-a-change' className='text-black'>Donations</Link></li>
                    </div>
                </div>

            </div>
        </div>
    )
}
