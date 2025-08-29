import Footer from "./component/Footer/Footer";
import { Header } from "./component/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import FeatureCard from "./component/FeatureCard/FeatureCard";
import Banner from "./component/Banner/Banner";
import HotelCard from "./component/HotelCard/HotelCard";
function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
      <FeatureCard />
      <HotelCard />
      <Footer />
    </div>
  );
}

export default App;
