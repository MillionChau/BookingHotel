import React, { useState } from "react";

function SearchFilter() {
  const [filters, setFilters] = useState({
    location: "",
    priceFrom: 0,
    priceTo: 5000000,
    roomType: "Tất cả",
    stars: "Tất cả",
  });

  // Cập nhật state khi nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Xóa lọc (reset form)
  const handleReset = () => {
    setFilters({
      location: "",
      priceFrom: 0,
      priceTo: 5000000,
      roomType: "Tất cả",
      stars: "Tất cả",
    });
  };

  // Tìm kiếm (gọi API hoặc console log)
  //   const handleSearch = () => {
  //     console.log("Filters:", filters);
  //     // TODO: gọi API tìm kiếm ở đây
  //   };

  return (
    <div className="container mt-4">
      <h5 className="mb-3 fw-bold">Tìm kiếm & Lọc phòng</h5>
      <div className="row g-3">
        {/* Địa điểm */}
        <div className="col-md-12">
          <input
            type="text"
            name="location"
            className="form-control"
            placeholder="Nhập địa điểm"
            value={filters.location}
            onChange={handleChange}
          />
        </div>

        {/* Giá từ */}
        <div className="col-md-6">
          <label className="form-label">Giá từ</label>
          <input
            type="number"
            name="priceFrom"
            className="form-control"
            value={filters.priceFrom}
            onChange={handleChange}
          />
        </div>

        {/* Giá đến */}
        <div className="col-md-6">
          <label className="form-label">Giá đến</label>
          <input
            type="number"
            name="priceTo"
            className="form-control"
            value={filters.priceTo}
            onChange={handleChange}
          />
        </div>

        {/* Loại phòng */}
        <div className="col-md-6">
          <label className="form-label">Loại phòng</label>
          <select
            name="roomType"
            className="form-select"
            value={filters.roomType}
            onChange={handleChange}>
            <option>Tất cả</option>
            <option>Phòng đơn</option>
            <option>Phòng đôi</option>
            <option>Suite</option>
          </select>
        </div>

        {/* Số sao */}
        <div className="col-md-6">
          <label className="form-label">Số sao</label>
          <select
            name="stars"
            className="form-select"
            value={filters.stars}
            onChange={handleChange}>
            <option>Tất cả</option>
            <option>1 sao</option>
            <option>2 sao</option>
            <option>3 sao</option>
            <option>4 sao</option>
            <option>5 sao</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="col-md-12 d-flex justify-content-end gap-2 mt-2">
          <button
            className="btn btn-primary"
            type="button"
            // onClick={handleSearch}
          >
            <i className="bi bi-search me-2"></i> Tìm kiếm
          </button>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={handleReset}>
            <i className="bi bi-x-circle me-2"></i> Xóa lọc
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
