import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Header.scss";
export function Header() {
  // state lưu thông tin user
  // null = chưa đăng nhập,có = chứa thông tin user
  const [user, setUser] = useState(null);

  //đăng nhập
  const handleLogin = () => {
    setUser({ username: "" });
  };

  //đăng xuất
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <>
      <div className="header">
        <Navbar expand="lg" className="shadow-sm">
          <Container>
            {/* logo */}
            <Navbar.Brand href="/" className="fw-bold">
              <i className="bi bi-building me-2"></i> BookingHotel
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              {/* menu trái */}
              <Nav className="me-auto">
                <Nav.Link href="/">Trang chủ</Nav.Link>
                <Nav.Link as={Link} to="./BookingHotel">
                  Đặt phòng
                </Nav.Link>
                <Nav.Link as={Link} to="/Favorites">Yêu thích</Nav.Link>
                <Nav.Link href="/phong-da-dat">Phòng đã đặt</Nav.Link>
              </Nav>

              {/* menu phải */}
              <Nav>
                <Nav.Link className="evaluate" href="/danh-gia">
                  <i className="bi bi-star me-1"></i> Đánh giá
                </Nav.Link>

                {/*chưa đăng nhập */}
                {!user && (
                  <NavDropdown
                    title={
                      <span>
                        <i className="bi bi-person-circle me-1"></i> Tài khoản
                      </span>
                    }
                    id="basic-nav-dropdown"
                    align="end">
                    {/* === THAY ĐỔI DÒNG NÀY === */}
                    <NavDropdown.Item as={Link} to="/login">
                      Đăng nhập
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/register">
                      Đăng ký
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {/*đã đăng nhập */}
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
    </>
  );
}
