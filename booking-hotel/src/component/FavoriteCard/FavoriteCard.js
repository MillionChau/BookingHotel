import React from "react";
import "./FavoriteCard.scss";
import { Trash } from "react-bootstrap-icons";

const favoriteHotel = {
  id: 1,
  img: "https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=600",
  nameHotel: "Sunrise Hotel",
  addressHotel: "TP. Hồ Chí Minh",
  type: "Cao cấp",
};

function FavoriteList() {
  return (
    <section className="favorite-page-container">
      <h3 className="page-title">Danh mục yêu thích</h3>

      <div className="favorite-card-wrapper">
        <div className="card shadow-sm">
          <img
            src={favoriteHotel.img}
            className="card-img-top"
            alt={favoriteHotel.nameHotel}
          />
          <div className="card-body">
            <h5 className="card-title fw-bold">{favoriteHotel.nameHotel}</h5>
            <p className="card-text text-muted">
              {favoriteHotel.addressHotel} • {favoriteHotel.type}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              <button className="btn btn-primary px-3">
                Đặt ngay
              </button>
              <button className="btn btn-icon text-danger">
                <Trash size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FavoriteList;