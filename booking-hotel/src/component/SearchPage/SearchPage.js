import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import Fuse from "fuse.js";
import "./SearchPage.scss";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import HotelCard from "../HotelCard/HotelCard";
import Loading from "../Loading/Loading";
import { API_BASE_URL } from "../../config/api";

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

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 250);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getUserId = useCallback(() => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch {
      return null;
    }
  }, []);
  const userId = getUserId();

  const fetchAndMergeFavorites = useCallback(
    async (hotelData) => {
      let favoriteList = [];
      if (userId) {
        try {
          const resFav = await axios.get(
            `${API_BASE_URL}/favorite/user/${userId}`
          );
          favoriteList = resFav.data || [];
        } catch {
          console.error("Không thể tải danh sách yêu thích");
        }
      }
      return hotelData.map((hotel) => {
        const fav = favoriteList.find((f) => f.hotelId === hotel.hotelId);
        return {
          ...hotel,
          isFavorite: !!fav,
          favoriteId: fav ? fav._id : null,
        };
      });
    },
    [userId]
  );

  // Lấy danh sách khách sạn
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/hotel/all`);
        const data = await fetchAndMergeFavorites(res.data.HotelList || []);
        setDataHotels(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadHotels();
  }, [fetchAndMergeFavorites]);

  // =================== TÌM KIẾM VỚI FUSE.JS (ĐÃ FIX) ===================
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/hotel/all`);
      const data = res.data.HotelList || [];

      console.log("📦 Dữ liệu khách sạn:", data);

      if (!destination.trim()) {
        setError("Vui lòng nhập điểm đến hoặc tên khách sạn.");
        setSearchResults([]);
        setLoading(false);
        return;
      }

      // ✅ Tự động nhận diện key có chứa tên khách sạn
      const sample = data[0] || {};
      const possibleKeys = [
        "hotelName",
        "name",
        "title",
        "address",
        "city",
        "district",
      ];
      const searchKeys = possibleKeys.filter((key) => key in sample);
      if (searchKeys.length === 0) {
        searchKeys.push(...Object.keys(sample));
      }

      // ✅ Cấu hình Fuse.js cho tìm kiếm tương đối
      const fuse = new Fuse(data, {
        keys: searchKeys,
        includeScore: true,
        threshold: 0.45, // cho phép sai khác nhẹ (fuzzy)
        distance: 100,
        ignoreLocation: true,
        minMatchCharLength: 1,
      });

      const results = fuse.search(destination);
      console.log("🔍 Kết quả Fuse:", results);

      const matched = results.map((r) => r.item);
      const withFav = await fetchAndMergeFavorites(matched);
      setSearchResults(withFav);

      if (withFav.length === 0) {
        showToastMessage(
          `Không tìm thấy khách sạn phù hợp với "${destination}".`,
          "warning"
        );
      } else {
        showToastMessage(
          `Tìm thấy ${withFav.length} khách sạn phù hợp!`,
          "success"
        );
      }
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách sạn. Vui lòng thử lại.");
      setSearchResults([]);
      showToastMessage("Lỗi khi tải dữ liệu khách sạn!", "danger");
    } finally {
      setLoading(false);
    }
  }, [destination, fetchAndMergeFavorites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleToggleFavorite = (hotelId, isFav, favId) => {
    setSearchResults((prev) =>
      prev.map((hotel) =>
        hotel.hotelId === hotelId
          ? { ...hotel, isFavorite: isFav, favoriteId: favId }
          : hotel
      )
    );
  };

  const renderContent = () => {
    if (loading) return <Loading />;

    if (error) return <Alert variant="danger">{error}</Alert>;

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

    const visibleResults = searchResults.slice(0, visibleCount);

    if (searchResults.length > 0) {
      return (
        <>
          <h4 className="fw-bold mb-4">
            Tìm thấy {searchResults.length} kết quả cho:{" "}
            <span className="text-primary">"{destination}"</span>
          </h4>
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
          Không tìm thấy kết quả cho <strong>{destination}</strong>.
        </Alert>
      );
    }
  };

  return (
    <Container className="search-page my-5 pt-4">
      {/* FORM TÌM KIẾM */}
      <Form
        onSubmit={handleSubmit}
        className={`p-2 mb-4 bg-light rounded shadow-sm ${
          isSticky ? "sticky-search" : ""
        }`}>
        <Row className="g-3 align-items-end">
          <Col md={6}>
            <div className="mb-1">
              <strong>Điểm đến hoặc tên khách sạn</strong>
            </div>
            <Form.Group
              controlId="formDestination"
              className="d-flex align-items-center border border-1 border-secondary rounded-2 position-relative">
              <Form.Control
                className="border-0 bg-none"
                type="text"
                placeholder="Ví dụ: Hà Nội, The Bloom Classic..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                ref={InputRef}
              />
              {!!destination && (
                <div
                  onClick={() => {
                    setDestination("");
                    InputRef.current.focus();
                  }}
                  className="position-absolute"
                  style={{ right: "10px", cursor: "pointer" }}>
                  <i className="bi bi-x-lg"></i>
                </div>
              )}
            </Form.Group>
          </Col>
          <Col md={2}>
            <Button variant="primary" type="submit" className="w-100">
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Tìm Kiếm"
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col md={8} lg={9} className="mx-auto">
          {renderContent()}
        </Col>
      </Row>

      {/* TOAST THÔNG BÁO */}
      <ToastContainer
        position="top-end"
        className="p-3 position-fixed"
        style={{ zIndex: 9999, top: "100px", right: "20px" }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={4000}
          autohide
          bg={toastVariant}>
          <Toast.Header className={`bg-${toastVariant} text-white`}>
            <strong className="me-auto">
              {toastVariant === "success"
                ? "✅ Thành công"
                : toastVariant === "danger"
                ? "❌ Lỗi"
                : "⚠️ Cảnh báo"}
            </strong>
          </Toast.Header>
          <Toast.Body className="bg-light">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default SearchPage;
