const Room = require('../models/room');
const Hotel = require('../models/hotel');
const Review = require('../models/review');

class RatingService {
  async updateRoomAndHotelRating(roomId) {
    try {
      const reviews = await Review.find({ roomId });
      const roomRating = reviews.length
        ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length
        : 0;

      const room = await Room.findOneAndUpdate(
        { roomId },
        { rating: parseFloat(roomRating.toFixed(1)) },
        { new: true }
      );

      if (!room) return;

      const hotelId = room.hotelId;
      if (!hotelId) {
        console.warn(`Phòng ${roomId} không có hotelId, bỏ qua cập nhật khách sạn`);
        return;
      }

      const rooms = await Room.find({ hotelId, rating: { $gt: 0 } });

      if (rooms.length === 0) {

        await Hotel.findOneAndUpdate({ hotelId }, { rating: 0 });
        console.log(`Khách sạn ${hotelId} chưa có phòng nào được đánh giá.`);
        return;
      }
      const total = rooms.reduce((sum, r) => sum + Number(r.rating || 0), 0);
      const hotelRating = total / rooms.length;

      await Hotel.findOneAndUpdate(
        { hotelId },
        { rating: parseFloat(hotelRating.toFixed(1)) }
      );

      console.log(`Cập nhật rating cho phòng ${roomId} & khách sạn ${hotelId} thành công!`);
    } catch (err) {
      console.error('Lỗi khi cập nhật rating:', err);
    }
  }
}

module.exports = new RatingService();
