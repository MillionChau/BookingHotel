import React, { useState, useCallback, useEffect } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import HotelCard from "../HotelCard/HotelCard";
import { FaSearch } from "react-icons/fa";
import "./SearchPage.scss";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(query.get("destination") || "");
  const [searchResults, setSearchResults] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(false); // Set to false initially
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(!!query.get("destination"));

  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      return userString ? JSON.parse(userString).id : null;
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
      return null;
    }
  };
  const userId = getUserId();

  const fetchAndMergeFavorites = async (hotelData) => {
    if (!userId) {
      return hotelData.map(hotel => ({ ...hotel, isFavorite: false, favoriteId: null }));
    }
    try {
      const resFav = await axios.get(`http://localhost:5360/favorite/user/${userId}`);
      const favoriteList = resFav.data || [];
      const favoriteHotelIds = new Map(favoriteList.map(fav => [fav.hotelId, fav._id]));
      
      return hotelData.map((hotel) => {
        const isFav = favoriteHotelIds.has(hotel.hotelId);
        return {
          ...hotel,
          isFavorite: isFav,
          favoriteId: isFav ? favoriteHotelIds.get(hotel.hotelId) : null,
        };
      });
    } catch (favError) {
      console.error("Could not fetch favorites", favError);
      // Return original data if favorites fail to load
      return hotelData.map(hotel => ({ ...hotel, isFavorite: false, favoriteId: null }));
    }
  };

  const handleSearch = useCallback(async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    const trimmedQuery = searchQuery ? searchQuery.trim() : "";
    const isSearching = !!trimmedQuery;
    setSearched(isSearching);

    // Use backend search if a query exists, otherwise fetch all
    const url = isSearching
      ? `http://localhost:5360/hotel/search?address=${encodeURIComponent(trimmedQuery)}`
      : "http://localhost:5360/hotel/all";

    try {
      const res = await axios.get(url);
      const data = res.data.HotelList || [];
      
      const dataWithFavorites = await fetchAndMergeFavorites(data);
      setSearchResults(dataWithFavorites);

      // Update URL to reflect the search state without reloading the page
      const searchParams = new URLSearchParams();
      if (isSearching) {
        searchParams.set("destination", trimmedQuery);
      }
      navigate(`?${searchParams.toString()}`, { replace: true });

    } catch (err) {
      console.error(err);
      setError("Không thể tải danh sách khách sạn. Vui lòng thử lại sau.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [userId, navigate]); // Dependencies for the search logic

  // Effect to run the search on initial component load
  useEffect(() => {
    const initialDestination = query.get("destination") || "";
    handleSearch(initialDestination);
  }, [handleSearch]); // Run once when handleSearch is stable

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(destination);
  };

  const handleToggleFavorite = (hotelId, isFav, favId) => {
    setSearchResults((prev) =>
      prev.map((hotel) =>
        hotel.hotelId === hotelId
          ? { ...hotel, isFavorite: isFav, favoriteId: favId }
          : hotel
      )
    );
    // DO NOT navigate away. Let the user continue browsing.
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
                Kết quả cho: <span className="text-primary">{query.get("destination")}</span>
              </>
            ) : (
              "Khám phá tất cả khách sạn"
            )}
          </h2>
          <Row xs={1} md={2} lg={3} className="g-4">
            {visibleResults.map((s) => (
              <Col key={s.hotelId}>
                {/* Ensure hotelId is passed for toggle updates */}
                <HotelCard
                  hotel={s}
                  hotelId={s.hotelId}
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
            <strong>"{query.get("destination")}"</strong>.
          </Alert>
        );
      }
      return (
        <Alert variant="info" className="text-center">
          Không có khách sạn nào để hiển thị.
        </Alert>
      );
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

      <div className="search-results-container mt-5">{renderContent()}</div>
    </Container>
  );
}

export default SearchPage;