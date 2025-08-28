import { Header } from "./component/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import FeatureCard from "./component/FeatureCard/FeatureCard";
import { Banner } from "./component/Banner/Banner";
function App() {
  return (
    <div className="App">
      <Header />
      <Banner />
      <FeatureCard />
    </div>
  );
}

export default App;
