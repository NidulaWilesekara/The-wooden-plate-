import React from "react";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection";
import ChefsSpecials from "../components/ChefsSpecials";
import GallerySection from "../components/GallerySection";
import ContactSection from "../components/ContactSection";
import PromoBannerStrip from "../components/PromoBannerStrip";
import NewProductBannerStrip from "../components/NewProductBannerStrip";
import MenuCategoriesSection from "../components/MenuCategoriesSection";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="bg-[#0F0A08]">
      <Hero />

      <PromoBannerStrip />

      <NewProductBannerStrip />

      <AboutSection />

      <MenuCategoriesSection />

      <ChefsSpecials />

      <GallerySection/>

      <ContactSection />

      <Footer />

    </div>
  );
};

export default HomePage;
