import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CustomerLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#0F0A08] text-[#E7D2B6] flex flex-col">
      <Navbar />

      {/* ✅ FULL WIDTH MAIN */}
      <main className="flex-1 w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default CustomerLayout;
