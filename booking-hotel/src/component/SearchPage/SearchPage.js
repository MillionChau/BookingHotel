import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SearchPage.css";
import HotelCard from "../HotelCard/HotelCard";

function SearchPage() {
  return (
    <div className="container mt-4 search-page">
      {/* Thanh tìm kiếm */}
      <div className="row mb-4">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Địa điểm"
            defaultValue="Hà Nội"
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            placeholder="Nhận phòng"
          />
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control" placeholder="Trả phòng" />
        </div>
        <div className="col-md-3 d-grid">
          <button className="btn btn-primary">
            <i className="bi bi-search me-2"></i> Tìm kiếm
          </button>
        </div>
      </div>

      <div className="row">
        {/* Sidebar bộ lọc */}
        <div className="col-md-3">
          <div className="card p-3">
            <h5 className="mb-3">Bộ lọc</h5>
            <div className="mb-3">
              <label className="form-label">Khoảng giá</label>
              <input
                type="range"
                className="form-range"
                min="200000"
                max="5000000"
              />
              <div className="d-flex justify-content-between">
                <small>200k</small>
                <small>5tr</small>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Loại phòng</label>
              <select className="form-select">
                <option>Tất cả</option>
                <option>Phòng đơn</option>
                <option>Phòng đôi</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Số sao</label>
              <select className="form-select">
                <option>Tất cả</option>
                <option>3 sao</option>
                <option>4 sao</option>
                <option>5 sao</option>
              </select>
            </div>
            <button className="btn btn-outline-secondary">Xóa lọc</button>
          </div>
        </div>

        {/* Danh sách khách sạn */}
        <div className="col-md-9">
          <HotelCard />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
