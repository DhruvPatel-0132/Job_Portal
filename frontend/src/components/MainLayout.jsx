import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MessagingPopup from './MessagingPopup';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />
      <Outlet />
      <MessagingPopup />
    </div>
  );
};

export default MainLayout;
