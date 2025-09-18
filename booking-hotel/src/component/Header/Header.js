import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Header.scss";

function Header() {
  const [user, setUser] = useState(null);

  const handleLogin = () => {
    setUser({ username: "demo" });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="header">
      <Navbar expand="lg" className="shadow-sm">
        <Container>
          {/* logo */}
          <Navbar.Brand as={NavLink} to="/" className="fw-bold">
            <i className="bi bi-building me-2"></i> BookingHotel
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* menu trái */}
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/" end>
                Trang chủ
              </Nav.Link>
              <Nav.Link as={NavLink} to="/BookingHotel">
                Đặt phòng
              </Nav.Link>
              <Nav.Link as={NavLink} to="/FavoriteCard">
                Yêu thích
              </Nav.Link>
              <Nav.Link as={NavLink} to="/BookingList">
                Phòng đã đặt
              </Nav.Link>
            </Nav>

            {/* menu phải */}
            <Nav>
              <Nav.Link as={NavLink} to="/danh-gia">
                <i className="bi bi-star me-1"></i> Đánh giá
              </Nav.Link>

              {!user && (
                <NavDropdown
                  title={
                    <span>
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
              )}

              {user && (
                <NavDropdown
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>{" "}
                      {user.username}
                    </span>
                  }
                  id="user-nav-dropdown"
                  align="end">
                  <NavDropdown.Item onClick={handleLogout}>
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
