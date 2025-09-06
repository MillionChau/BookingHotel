import { lazy } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../component/Header/Header";
import Footer from "../component/Footer/Footer";
import Banner from "../component/Banner/Banner";
import { HotelCard } from "../component/HotelCard/HotelCard";
import FeatureCard from "../component/FeatureCard/FeatureCard";
// Lazy load các trang khác
const Login = lazy(() => import("../component/Login/Login"));
const Register = lazy(() => import("../component/Register/Register"));
const BookingHotel = lazy(() =>
  import("../component/BookingHotel/BookingHotel")
);
const BookingList = lazy(() => import("../component/BookingList/BookingList"));
const FavoriteCard = lazy(() =>
  import("../component/FavoriteCard/FavoriteCard")
);

const MainLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);
const HomePage = () => {
  return (
    <>
      <Banner />;
      <FeatureCard />
      <HotelCard />
    </>
  );
};
const HeaderOnlyLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

/* -------- Routes config -------- */
const routes = [
  {
    path: "/",
    component: HomePage,
    layout: MainLayout,
  },
  {
    path: "/BookingHotel",
    component: BookingHotel,
    layout: HeaderOnlyLayout,
  },
  {
    path: "/BookingList",
    component: BookingList,
    layout: HeaderOnlyLayout,
  },
  {
    path: "/FavoriteCard",
    component: FavoriteCard,
    layout: HeaderOnlyLayout,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/register",
    component: Register,
  },
];

export default routes;
