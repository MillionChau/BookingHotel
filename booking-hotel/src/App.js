import Footer from "./component/Footer/Footer";
import { Header } from "./component/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { Banner } from "./component/Banner/Banner";
import FeatureCard from "./component/FeatureCard/FeatureCard";

function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
      <FeatureCard />
      <Footer />
    </div>
  );
}

export default App;
