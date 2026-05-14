import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import MessagingPopup from './MessagingPopup';
import ChatWindow from './ChatWindow';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <Navbar />
      <Outlet />
      <MessagingPopup />
      <ChatWindow />
    </div>
  );
};

export default MainLayout;
