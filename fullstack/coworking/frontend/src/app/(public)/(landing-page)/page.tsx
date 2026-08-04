import CtaBanner from "../../components/landingComponents/CtaBanner";
import Features from "../../components/landingComponents/Features";
import Footer from "../../components/landingComponents/Footer";
import Hero from "../../components/landingComponents/Hero";
import HowItWorks from "../../components/landingComponents/HowItWorks";
import LandingHeader from "../../components/landingComponents/LandingHeader";
import Stats from "../../components/landingComponents/Stats";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <CtaBanner />
      <Footer />
    </>
  );
}