import "./HotelCard.scss";
import { GeoAlt, StarFill, BagPlus } from "react-bootstrap-icons";
function HotelCard() {
  const hotelCard = [
    {
      id: 1,
      img: "https://fastly.picsum.photos/id/436/600/400.jpg?hmac=6veY95w-1BubK3-QT9BHXUkrpYvfzURjRgNimYhmcmU",
      nameHotel: "Sunrise Hotel",
      iconStar: 3,
      addressHotel: "TP. Hồ Chí Minh",
      price: 950000,
    },
    {
      id: 2,
      img: "https://fastly.picsum.photos/id/787/600/400.jpg?hmac=BNah2GlH1mF6ahc9LeQK6FAvlTiCGUBJjVnPjMtek7A",
      nameHotel: "Moonlight Resort",
      iconStar: 5,
      addressHotel: "Đà Nẵng",
      price: 2200000,
    },
    {
      id: 3,
      img: "https://fastly.picsum.photos/id/21/600/400.jpg?hmac=22djDbPZb-X3QNxWMbezd6UGG8imBp5Pq4-dJg2UPug",
      nameHotel: "Lotus Inn",
      iconStar: 3,
      addressHotel: "Hà Nội",
      price: 500000,
    },
    {
      id: 4,
      img: "https://fastly.picsum.photos/id/21/600/400.jpg?hmac=22djDbPZb-X3QNxWMbezd6UGG8imBp5Pq4-dJg2UPug",
      nameHotel: "Ocean View",
      iconStar: 4,
      addressHotel: "Nha Trang",
      price: 1200000,
    },
    {
      id: 5,
      img: "https://scontent.iocvnpt.com/resources/portal//Images/QBH/adminqbh/Homestay/Green%20Valley%20Hotel/154179179_636953293903264445.jpg",
      nameHotel: "Green Valley Hotel",
      iconStar: 4,
      addressHotel: "Đà Lạt",
      price: 1350000,
    },
    {
      id: 6,
      img: "https://q-xx.bstatic.com/xdata/images/hotel/max1024/568642897.jpg?k=68d99023715161fd4411b57894af07f930e48cb8eca39cd83246a09c20c45528&o=",
      nameHotel: "Golden Dragon Hotel",
      iconStar: 5,
      addressHotel: "Huế",
      price: 1850000,
    },
    {
      id: 7,
      img: "https://fastly.picsum.photos/id/436/600/400.jpg?hmac=6veY95w-1BubK3-QT9BHXUkrpYvfzURjRgNimYhmcmU",
      nameHotel: "Sunrise Hotel",
      iconStar: 3,
      addressHotel: "TP. Hồ Chí Minh",
      price: 950000,
    },
    {
      id: 8,
      img: "https://fastly.picsum.photos/id/787/600/400.jpg?hmac=BNah2GlH1mF6ahc9LeQK6FAvlTiCGUBJjVnPjMtek7A",
      nameHotel: "Moonlight Resort",
      iconStar: 5,
      addressHotel: "Đà Nẵng",
      price: 2200000,
    },
  ];
  return (
    <>
      <section className="py-4 bg-light">
        <div className="container  mb-5">
          <div className="h4 mb-4">Khách sạn nổi bật</div>
          <div className="row g-4">
            {hotelCard.map((hotelItem, index) => (
              <div key={index} className="hotelCard col-12 col-md-4 col-lg-3">
                <div className="border rounded shadow-sm d-flex flex-column align-items-start h-100">
                  <img
                    src={hotelItem.img}
                    alt={hotelItem.nameHotel}
                    className="img-fluid rounded"
                  />
                  <div className="p-3 w-100">
                    <div className=" mt-3 d-flex justify-content-between">
                      <h4 className="fw-bold  fs-5">{hotelItem.nameHotel}</h4>
                      <div class="d-flex justify-content-between align-items-start">
                        <span class="d-flex align-items-center  badge text-bg-warning">
                          <StarFill />
                          {hotelItem.iconStar}
                        </span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center card-text small text-muted mb-2">
                      <GeoAlt size={14} />
                      {hotelItem.addressHotel}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="fw-semibold">
                        {hotelItem.price.toLocaleString("vi-VN")} ₫/đêm
                      </span>
                      <a
                        href="booking.html"
                        class="booking btn btn-sm btn-primary d-flex align-items-center">
                        <BagPlus /> Đặt
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HotelCard;
