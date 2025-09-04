import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { Routes, Route, Outlet } from "react-router-dom";

import { Header } from './component/Header/Header';
import Footer from './component/Footer/Footer';
import Banner from './component/Banner/Banner';
import Login from './component/Login/Login';
import Register from './component/Register/Register';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const HomePage = () => {
    return <Banner />;
};


function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
