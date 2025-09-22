"use client";
import React, { Suspense, lazy } from "react";
import BottomHeader from "./Components/Header/BottomHeader";
import MiddleHeader from "./Components/Header/MiddleHeader";
import TopHeader from "./Components/Header/TopHeader";
import Articles from "./Pages/ArticlePage";
import FooterBottom from "./Components/Footer/FooterBottom";

export default function Home() {
 

  

  return (
    <main>
      {/* Header Section */}
      
        <TopHeader />
        <MiddleHeader />
        <BottomHeader />
     

      {/* Main Content */}
      <section>
        <Articles />
      </section>

      <section>
       
        <FooterBottom />
        
      </section>
    </main>
  );
}
