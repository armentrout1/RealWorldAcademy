import React from "react";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import KeyFeatures from "@/components/home/KeyFeatures";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCourses />
      <KeyFeatures />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;
