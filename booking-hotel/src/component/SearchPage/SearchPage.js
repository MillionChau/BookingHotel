import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
  InputGroup,
  Card,
} from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";
import { FaStar } from "react-icons/fa";
import Loading from "../Loading/Loading";
import "./SearchPage.scss";

function SearchPage() {
  const InputRef = useRef();
  const [destination, setDestination] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [dataHotels, setDataHotels] = useState([]);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lấy userId từ localStorage
  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      return null;
    }
  };
  const userId = getUserId();
  function normalize(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }
  useEffect(() => {
    const dataHotel = async () => {
      try {
        const res = await axios.get("http://localhost:5360/hotel/all");
        setDataHotels(res.data.HotelList || []);
      } catch (err) {
        console.error(err);
      }
    };
    dataHotel();
  }, []);
  // Hàm tìm kiếm khách sạn
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Lấy danh sách khách sạn
      const res = await axios.get("http://localhost:5360/hotel/all");
      let data = res.data.HotelList || [];

      // Lọc theo điểm đến
      if (destination.trim() === "") {
        setError("Vui lòng nhập điểm đến hoặc tên khách sạn.");
        setSearchResults([]);
        setLoading(false);
        return;
      }
      if (destination.trim() !== "") {
        const dataNorm = data.map((h) => ({
          ...h,
          name_norm: normalize(h.name),
          address_norm: normalize(h.address),
        }));

        const destNorm = normalize(destination);

        const terms = destNorm.split(/\s+/).filter((t) => t);

        let matched = dataNorm;

        terms.forEach((term) => {
          const fuseTerm = new Fuse(matched, {
            keys: ["name_norm", "address_norm"],
            threshold: 0.4,
          });
          matched = fuseTerm.search(term).map((r) => r.item);
        });

        const matchedSet = new Set(matched.map((h) => h._id));
        data = data.filter((h) => matchedSet.has(h._id));
      }

      // Lấy danh sách yêu thích của user
      let favoriteList = [];
      if (userId) {
        const resFav = await axios.get(
          `http://localhost:5360/favorite/user/${userId}`
        );
        favoriteList = resFav.data || [];
      }

      // Map trạng thái isFavorite cho danh sách kết quả
      const dataWithFavorite = data.map((hotel) => {
        const fav = favoriteList.find((f) => f.hotelId === hotel.hotelId);
        return {
          ...hotel,
          isFavorite: !!fav,
          favoriteId: fav ? fav._id : null,
        };
      });

      setSearchResults(dataWithFavorite);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách sạn. Vui lòng thử lại.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [destination, userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
    setSearched(true);
  };

  // Cập nhật lại state khi HotelCard toggle favorite
  const handleToggleFavorite = (hotelId, isFav, favId) => {
    setSearchResults((prev) =>
      prev.map((hotel) =>
        hotel.hotelId === hotelId
          ? { ...hotel, isFavorite: isFav, favoriteId: favId }
          : hotel
      )
    );
  };

  // Render kết quả
  const renderContent = () => {
    if (!searched) {
      return (
        <Row xs={1} md={3} className="g-4">
          {dataHotels.slice(0, 6).map((hotel) => (
            <Col key={hotel.hotelId}>
              <HotelCard
                hotelId={hotel.hotelId}
                userId={userId}
                isFavoriteDefault={hotel.isFavorite}
                favoriteIdDefault={hotel.favoriteId}
                hotel={hotel}
                onToggleFavorite={handleToggleFavorite}
              />
            </Col>
          ))}
        </Row>
      );
    }

    if (loading) {
      return <Loading />;
    }

    if (error) return <Alert variant="danger">{error}</Alert>;

    const visibleResults = searchResults.slice(0, visibleCount);

    if (searchResults.length > 0) {
      return (
        <>
          <Row xs={1} md={3} className="g-4">
            {visibleResults.map((s) => (
              <Col key={s.hotelId}>
                <HotelCard
                  hotelId={s.hotelId}
                  userId={userId}
                  isFavoriteDefault={s.isFavorite}
                  favoriteIdDefault={s.favoriteId}
                  hotel={s}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Col>
            ))}
          </Row>

          {visibleCount < searchResults.length && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={() => setVisibleCount(visibleCount + 6)}>
                Xem thêm
              </Button>
            </div>
          )}
        </>
      );
    } else {
      return (
        <Alert variant="warning">
          Không tìm thấy kết quả <strong>{destination}</strong>.
        </Alert>
      );
    }
  };

  return (
    <Container className="search-page my-5 pt-4 ">
      {/* --- FORM TÌM KIẾM --- */}
      <Form
        onSubmit={handleSubmit}
        className={`p-2 mb-4 bg-light rounded shadow-sm ${
          isSticky ? "sticky-search" : ""
        }`}>
        <Row className="g-3 align-items-end">
          <Col md={6}>
            <div className="mb-1">
              <strong>Điểm đến</strong>
            </div>
            <Form.Group
              controlId="formDestination"
              className={`d-flex align-items-center border border-1 border-secondary rounded-2 
              }`}>
              <Form.Control
                className="border-0 bg-none"
                type="text"
                placeholder="Ví dụ: Hà Nội, Vũng Tàu..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                ref={InputRef}
              />
              {/* convert destination sang boolean */}
              {!!destination && (
                <div
                  onClick={() => {
                    setDestination("");
                    InputRef.current.focus();
                  }}
                  className="position-absolute"
                  style={{ right: "52%" }}>
                  <i class="bi bi-x-lg"></i>
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              disabled={loading}>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Tìm Kiếm"
              )}
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />

      <Row>
        {/* --- KẾT QUẢ TÌM KIẾM --- */}
        <Col md={8} lg={9} className="mx-auto">
          {destination && (
            <h4 className={`fw-bold mb-4 ${isSticky ? " searchHotel" : ""}`}>
              Kết quả tìm kiếm
            </h4>
          )}
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}

export default SearchPage;
