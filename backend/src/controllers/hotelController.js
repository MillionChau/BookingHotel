const Hotel = require('../models/hotel')

class hotelController {
    async createHotel(req, res) {
        const { name, address, description, manager, imageUrl } = req.body;

        if (!name || !address) {
            return res.status(400).json({
                message: "Tên và địa chỉ là bắt buộc"
            });
        }

        try {
            const parts = address.split('-');

            if (parts.length < 2) {
                return res.status(400).json({
                    message: "Định dạng địa chỉ không hợp lệ. Ví dụ: Số nhà-Tên đường-Quận/Huyện-Thành phố-Tỉnh"
                });
            }

            const province = parts[parts.length - 1].trim();

            if (!province) {
                return res.status(400).json({
                    message: "Không thể xác định tỉnh/thành từ địa chỉ"
                });
            }

            let provinceInit = province
                .split(/\s+/)
                .map(word => word[0].toUpperCase())
                .join('');

            if (provinceInit.length > 2) {
                provinceInit = provinceInit.slice(-2);
            }

            const hotelName = name;
            let nameInit = hotelName
                .split(/\s+/)
                .map(word => word[0].toUpperCase())
                .join('');

            if (nameInit.length > 2) {
                nameInit = nameInit.slice(-2);
            }

            const currentYear = new Date().getFullYear();
            const yearStart = new Date(currentYear, 0, 1);
            const yearEnd = new Date(currentYear + 1, 0, 1);

            const hotelCount = await Hotel.countDocuments({
                createdAt: {
                    $gte: yearStart,
                    $lt: yearEnd
                }
            });

            const sequenceNumber = (hotelCount + 1).toString().padStart(4, '0');

            const hotelId = `${provinceInit + nameInit}-${currentYear}-${sequenceNumber}`;

            const newHotel = new Hotel({
                hotelId: hotelId,
                name: name,
                address: address,
                description: description,
                manager: manager,
                rating: 0,
                imageUrl: imageUrl
            });

            await newHotel.save();

            res.status(201).json({
                message: 'Thêm khách sạn thành công!',
                hotel: newHotel
            });
        } catch (err) {
            console.error('Error creating hotel:', err);
            return res.status(500).json({
                message: 'Lỗi server khi thêm khách sạn',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
    async updateHotel(req, res) {
        const { hotelId } = req.params
        const { name, address, description, manager, imageUrl } = req.body

        try {
            const editHotel = await Hotel.findOne({ hotelId })

            if (!editHotel)
                return res.status(404).json({ message: 'Khách sạn không tồn tại!' })

            editHotel.name = name
            editHotel.address = address
            editHotel.description = description
            editHotel.manager = manager
            editHotel.imageUrl = imageUrl

            await editHotel.save()

            res.status(200).json({ message: 'Chỉnh sửa thông tin khách sạn thành công!' })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getAllHotel(req, res) {
        try {
            const hotels = await Hotel.find()

            if (!hotels || hotels.length === 0)
                return res.status(404).json('Bạn chưa có khách sạn nào.')

            res.status(200).json({
                message: 'Lấy tất cả khách sạn thành công!',
                HotelList: hotels
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getHotelById(req, res) {
        const { hotelId } = req.params
        try {
            const hotel = await Hotel.findOne({ hotelId })

            if (!hotel)
                return res.status(404).json({ message: 'Không tìm thấy khách sạn!' })

            res.status(200).json({
                message: 'Lấy khách sạn thành công!',
                hotel: hotel
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async deleteHotel(req, res) {
        const { hotelId } = req.params;

        try {
            const hotel = await Hotel.findOne({ hotelId });

            if (!hotel) {
                return res.status(404).json({ message: 'Không tìm thấy khách sạn!' });
            }

            await Hotel.deleteOne({ hotelId });

            res.status(200).json({ message: 'Xoá khách sạn thành công!' });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new hotelController