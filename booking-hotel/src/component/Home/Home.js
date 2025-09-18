import React from "react";
import Header from "../Header/Header";
import FeatureCard from "../FeatureCard/FeatureCard";
import Banner from "../Banner/Banner";
import HotelCard from "../HotelCard/HotelCard";

function Home() {
  return (
    <div className="home-page">
      <Header />
      <Banner />
      <FeatureCard />
      <HotelCard />
    </div>
  );
}

export default Home;