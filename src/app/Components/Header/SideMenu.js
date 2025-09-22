import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaHiking, FaShoppingBag, FaVideo, FaFootballBall, FaGlobe, FaEllipsisH, FaHome, FaNewspaper, FaMountain } from 'react-icons/fa';
import { FaPhotoVideo } from "react-icons/fa";
import Link from 'next/link';
import Image from 'next/image';
import logo2 from './logo2.png';

const SideMenu = ({ onClose }) => {
   useEffect(() => {
    // Add a class to the body when the side menu is open to prevent scrolling
    document.body.classList.add('overflow-hidden');
    return () => {
      // Clean up: remove the class when the component is unmounted
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <div className=" z-50 fixed inset-0 flex justify-end">
      <div className="bg-white lg:w-1/5 w-3/5 max-w-md h-full shadow-lg transform transition-transform duration-3000 ease-in-out translate-x-0">
        <div className="p-4 border-b border-[#25609A] flex justify-between items-center">
          <Link href="/">
            <Image src={logo2} alt="Logo" width={120} height={40} />
          </Link>
          <FaTimes className="text-[#25609A] text-2xl cursor-pointer" onClick={onClose} />
        </div>
        <ul className="p-6 space-y-4">
        <li>
            <a href="/" className="flex items-center text-[#25609A] text-2xl hover:text-[#7BB761] transition-colors">
              <FaHome className="mr-3 text-2xl text-[#7BB761]" /> HomePage
            </a>
          </li>
         
          <li>
          <a href="/category/tourism" onClick={() => handleTransaction('tourism')} className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
            <FaHiking className="mr-3 text-2xl text-[#7BB761]" /> Tourism
          </a>
        </li>

          <li>
            <a href="/category/politics" className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
              <FaNewspaper className="mr-3 text-2xl text-[#7BB761]" /> Politics
            </a>
          </li>
          <li>
          <a href="/category/mountaineering" onClick={() => handleTransaction('mountaineering')} className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
            <FaMountain className="mr-3 text-2xl text-[#7BB761]" /> Mountaineering
          </a>
        </li>
          <li>
            <a href="/category/sports" className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
              <FaFootballBall className="mr-3 text-2xl text-[#7BB761]" /> Sports
            </a>
          </li>
          <li>
            <a href="/category/international" className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
              <FaGlobe className="mr-3 text-2xl text-[#7BB761]" /> International
            </a>
          </li>
          <li>
            <a href="/category/economics" className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
              <FaShoppingBag className="mr-3 text-2xl text-[#7BB761]" /> Economics
            </a>
          </li>
          <li>
            <a href="/category/photogallery" className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
              <FaPhotoVideo className="mr-3 text-2xl text-[#7BB761]" />Photo gallery
            </a>
          </li>
          <li>
            <a href="/videos" className="flex items-center text-[#25609A] text-xl hover:text-[#7BB761] transition-colors">
              <FaVideo className="mr-3 text-2xl text-[#7BB761]" /> Video Gallery
            </a>
          </li>
         
        </ul>
        <div className="p-6">
  <a href="https://theeverestnews.com" target="_blank" rel="noopener noreferrer">
    <button className="w-full px-4 py-2 bg-[#7BB761] text-white rounded hover:bg-green-600 transition-colors">
      Nepali
    </button>
  </a>
</div>

      </div>
    </div>
  );
};

SideMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SideMenu;