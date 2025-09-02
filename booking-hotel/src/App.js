import Footer from "./component/Footer/Footer";
import { Header } from "./component/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import FeatureCard from "./component/FeatureCard/FeatureCard";
import Banner from "./component/Banner/Banner";
import HotelCard from "./component/HotelCard/HotelCard";
import SearchPage from "./component/SearchPage/SearchPage";
import HotelDetail from "./component/HotelDetail/HotelDetail";
function App() {
  return (
    <div className="App">
      <Header />
      <HotelDetail />
      <Footer />
    </div>
  );
}

export default App;
