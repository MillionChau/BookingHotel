import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import HotelCard from "../HotelCard/HotelCard";
import { FaSearch } from "react-icons/fa";
import "./SearchPage.scss";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  const query = useQuery();
  const [destination, setDestination] = useState(query.get("destination") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searched, setSearched] = useState(!!query.get("destination"));

  
  const getUserId = useCallback(() => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  }, []);
  const userId = getUserId();

  
  const fetchAndMergeFavorites = useCallback(async (hotelData) => {
    let favoriteList = [];
    if (userId) {
      try {
        const resFav = await axios.get(
          `http://localhost:5360/favorite/user/${userId}`
        );
        favoriteList = resFav.data || [];
      } catch (favError) {
        console.error("Could not fetch favorites", favError);
      
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
  }, [userId]);


  const fetchAllHotels = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSearched(false);

    try {
      const res = await axios.get("http://localhost:5360/hotel/all");
      let data = res.data.HotelList || [];
      const dataWithFavorites = await fetchAndMergeFavorites(data);
      setSearchResults(dataWithFavorites);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách sạn. Vui lòng thử lại sau.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAndMergeFavorites]);

  const handleSearch = useCallback(async () => {
    if (!destination.trim()) {
      fetchAllHotels();
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await axios.get("http://localhost:5360/hotel/all");
      let data = res.data.HotelList || [];

    
      const filteredData = data.filter((item) =>
        item.address.toLowerCase().includes(destination.toLowerCase())
      );
      
      const dataWithFavorites = await fetchAndMergeFavorites(filteredData);
      setSearchResults(dataWithFavorites);
    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách sạn. Vui lòng thử lại sau.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [destination, fetchAllHotels, fetchAndMergeFavorites]);

  // Sử dụng ref để tránh dependency cycle
  const handleSearchRef = useRef(handleSearch);
  const fetchAllHotelsRef = useRef(fetchAllHotels);

  useEffect(() => {
    handleSearchRef.current = handleSearch;
    fetchAllHotelsRef.current = fetchAllHotels;
  }, [handleSearch, fetchAllHotels]);

  useEffect(() => {
    if (query.get("destination")) {
      handleSearchRef.current();
    } else {
      fetchAllHotelsRef.current();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 fs-5">Đang tải dữ liệu...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      );
    }

    if (searchResults.length > 0) {
      const visibleResults = searchResults.slice(0, visibleCount);
      return (
        <>
          <h2 className="mb-4 fw-bold">
            {searched ? (
              <>
                Kết quả cho: <span className="text-primary">{destination}</span>
              </>
            ) : (
              "Khám phá tất cả khách sạn"
            )}
          </h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {visibleResults.map((s) => (
              <Col key={s.hotelId}>
                <HotelCard
                  hotelId={s.hotelId} 
                  hotel={s}
                  userId={userId}
                  isFavoriteDefault={s.isFavorite}
                  favoriteIdDefault={s.favoriteId}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Col>
            ))}
          </Row>

          {visibleCount < searchResults.length && (
            <div className="text-center mt-5">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setVisibleCount(visibleCount + 6)}>
                Xem thêm kết quả
              </Button>
            </div>
          )}
        </>
      );
    } else {
      if (searched) {
        return (
          <Alert variant="warning" className="text-center">
            Rất tiếc, không tìm thấy khách sạn nào phù hợp tại{" "}
            <strong>"{destination}"</strong>.
          </Alert>
        );
      }
      return null;
    }
  };

   return (
    <Container className="search-page my-5">
      <Card className="shadow-sm search-bar-card">
        <Card.Body className="p-3">
          <h1 className="display-6 fw-bold text-center mb-4">
            Tìm kiếm nơi nghỉ dưỡng lý tưởng
          </h1>
          <Form onSubmit={handleSubmit}>
            <InputGroup className="input-group-lg">
              <Form.Control
                type="text"
                placeholder="Nhập thành phố, địa điểm hoặc tên khách sạn..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border-end-0"
              />
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="d-flex align-items-center">
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  <FaSearch />
                )}
                <span className="ms-2 d-none d-md-inline">Tìm Kiếm</span>
              </Button>
            </InputGroup>
          </Form>
        </Card.Body>
      </Card>

      <div className="search-results-container">{renderContent()}</div>
    </Container>
  );
}

export default SearchPage;