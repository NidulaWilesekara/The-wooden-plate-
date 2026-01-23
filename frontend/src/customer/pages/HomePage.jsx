import React from "react";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import MenuSection from "../components/MenuSection";
import ChefsSpecials from "../components/ChefsSpecials";
import GallerySection from "../components/GallerySection";
import ReservationSection from "../components/ReservationSection";
import ContactSection from "../components/ContactSection";
import Newsletter from "../components/Newsletter";

const HomePage = () => {
  return (
    <div className="bg-[#0F0A08]">
      <Hero />

      <AboutSection />

      <MenuSection />

      <ChefsSpecials />

      <GallerySection/>

      <ReservationSection/>

      <ContactSection />

      <Newsletter />

    </div>
  );
};

export default HomePage;
