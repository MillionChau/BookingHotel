import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo.png";
import Logo2 from "../../assets/Logo2.png";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import "./Header.scss";

function Header({ user, onLogout }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Nếu không phải trang chủ thì coi như đã scroll
  const isNotHome = location.pathname !== "/";
  const headerClass = `header ${
    scrolled || isNotHome ? "header-scrolled" : ""
  }`;

  return (
    <div className={headerClass}>
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          {/* logo */}
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            <img
              src={scrolled || isNotHome ? Logo2 : Logo}
              alt="Logo travel"
              className="header-img"
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* menu trái */}
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Trang chủ
              </Nav.Link>
              <Nav.Link as={NavLink} to="/bookingHotel">
                Đặt phòng
              </Nav.Link>
              <Nav.Link as={NavLink} to="/favoriteList">
                Yêu thích
              </Nav.Link>
              <Nav.Link as={NavLink} to="/bookingList">
                Phòng đã đặt
              </Nav.Link>
            </Nav>
            {/* menu phải */}
            <Nav>
              <Nav.Link as={NavLink} to="/danh-gia" className="feedback">
                <i className="bi bi-star me-1"></i> Đánh giá
              </Nav.Link>

              {!user ? (
                // Chưa đăng nhập
                <NavDropdown
                  title={
                    <span className="account">
                      <i className="bi bi-person-circle me-1"></i> Tài khoản
                    </span>
                  }
                  id="basic-nav-dropdown"
                  align="end">
                  <NavDropdown.Item as={NavLink} to="/login">
                    Đăng nhập
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/register">
                    Đăng ký
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // Đã đăng nhập
                <NavDropdown
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>{" "}
                      {user.fullname}
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end">
                  <NavDropdown.Item as={NavLink} to="/profile">
                    Thông tin tài khoản
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={onLogout}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
