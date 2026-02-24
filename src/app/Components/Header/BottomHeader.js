'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaRegCircleUser } from "react-icons/fa6";
import { RiMenuFold2Fill } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";

import Logo from '../assets/logo.png';
import SideMenu from './SideMenu';
import Search from './Search'; // Import your Search component

const BottomHeader = () => {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  return (
    <div className={`sticky top-0 z-50 transition duration-300 ease-in-out hidden md:block ${scrolled ? 'shadow-md' : ''}`}>
      <nav className="bg-[#25609A] text-white">
        <div className="container mx-auto flex justify-between items-center py-4 px-4 lg:px-20 font-semibold text-lg">
          <ul className="flex items-center gap-5">
            {scrolled && (
              <li className="transition duration-300 transform hover:scale-110">
                <Link href="/">
                  <Image src={Logo} alt="Logo" width={40} height={40} />
                </Link>
              </li>
            )}
            <li>
              <Link href="/" className="text-xl font-semibold text-[#52aed3] hover:text-[#7BB761] transition duration-300 ease-in-out">
                Home
              </Link>
            </li>
            <li>
              <Link href="/category/tourism" className="hover:text-[#7BB761] transition duration-300 ease-in-out">
                Tourism
              </Link>
            </li>
            <li>
              <Link href="/category/politics" className="hover:text-[#7BB761] transition duration-300 ease-in-out">
                Politics
              </Link>
            </li>
            <li>
              <Link href="/category/mountaineering" className="hover:text-[#7BB761] transition duration-300 ease-in-out">
                Mountaineering
              </Link>
            </li>
            <li>
              <Link href="/category/economics" className="hover:text-[#7BB761] transition duration-300 ease-in-out">
                Economics
              </Link>
            </li>
            <li>
              <Link href="/category/international" className="hover:text-[#7BB761] transition duration-300 ease-in-out">
                International
              </Link>
            </li>
            <li>
              <Link href="/category/sports" className="hover:text-[#7BB761] transition duration-300 ease-in-out">
                Sports
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-6 ml-10">
            {/* Search Button */}
            <button onClick={toggleSearchBar} className="hover:text-[#7BB761] transition duration-150 ease-in-out">
              <FaSearch className="text-xl" />
            </button>
            
            <Link href="http://theeverestnews.com">
              <span className="bg-[#7BB761] py-2 px-4 rounded hover:bg-white hover:text-[#7BB761] transition duration-150 ease-in-out">
                Nepali
              </span>
            </Link>
            <Link href="/login">
              <FaRegCircleUser className="cursor-pointer hover:text-[#7BB761] text-2xl" />
            </Link>
            <RiMenuFold2Fill
              className="cursor-pointer hover:text-[#7BB761] text-2xl"
              onClick={toggleSideMenu}
            />
          </div>
        </div>

        {/* Full-width Search Bar */}
        {showSearchBar && (
          <div className="container mx-auto px-4 lg:px-20 py-4 bg-[#25609A] border-t border-[#3a7ab5]">
            <Search onClose={toggleSearchBar} />
          </div>
        )}
      </nav>

      {sideMenuVisible && (
        <div className="absolute top-0 z-50 w-full bg-[#25609A]">
          <SideMenu onClose={toggleSideMenu} />
        </div>
      )}
    </div>
  );
};

export default BottomHeader;