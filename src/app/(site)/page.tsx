import Home from "@/components/Home";
import NexcellLandingPage from "@/components/Home/NexcellLandingPage";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nexcell Gadgets | Tech For Next Gen",
  description: "This is nexcell gadgets store",
  // other metadata
};

export default function HomePage() {
  return (
    <>
    
      <Home />
      
    </>
  );
}
