const Room = require('../models/room')
const Booking = require('../models/booking')
const Hotel = require('../models/hotel')

class roomController {
    async getAllRoom(req, res) {
        try {
            const rooms = await Room.find({})

            if (!rooms || rooms.length === 0)
                return res.status(404).json({ message: 'Không có dữ liệu phòng.'})

            res.status(200).json({
                message: 'Lấy dữ liệu phòng thành công!',
                rooms: rooms
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async createRoom(req, res) {
        const { hotelId, name, type, price, imageUrl, status } = req.body
        try {
            if(!hotelId || !name || !price)
                return res.status(400).json({message: 'Thiếu trường dữ liệu!'})

            const hotel = await Hotel.findOne({ hotelId })

            if(!hotel)
                return res.status(404).json({ message: 'Khách sạn không tồn tại!' })

            const roomId = `${hotelId}-${name}`

            const room = new Room({ roomId, hotelId, name, type, price, imageUrl, status })

            await room.save()
            res.status(201).json({
                room,
                message: 'Thêm phòng thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async updateRoom(req, res) {
        const { roomId } = req.params
        const { name, type, price, imageUrl, status } = req.body
        try {
            const room = await Room.findOne({ roomId })
            if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng!' })

            room.name = name || room.name
            room.type = type || room.type
            room.price = price || room.price
            room.imageUrl = imageUrl || room.imageUrl
            room.status = status || room.status

            await room.save()
            res.status(200).json({
                room,
                message: 'Cập nhật thông tin phòng thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
    async getRoomsByHotel(req, res) {
        const { hotelId } = req.params
        try {
            const rooms = await Room.find({ hotelId })
            if (!rooms || rooms.length === 0) {
                return res.status(404).json({ message: 'Không có phòng nào cho khách sạn này!' })
            }
            res.status(200).json({
                rooms,
                message: 'Lấy danh sách phòng theo khách sạn thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async getRoomById(req, res) {
        const { roomId } = req.params
        try {
            const room = await Room.findOne({ roomId })
            if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng!' })

            res.status(200).json({
                room,
                message: 'Lấy thông tin phòng thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async deleteRoom(req, res) {
        const { roomId } = req.params
        try {
            const room = await Room.findOne({ roomId })
            if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng!' })

            await Room.deleteOne(room)

            res.status(200).json({ message: 'Xoá phòng thành công!' })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async getHotelOccupany(req, res) {
        const { hotelId } = req.params

        try {
            const allRooms = await Room.find({ hotelId })
            const totalRooms = allRooms.length

            if(totalRooms === 0) {
                return res.status(404).json({
                    message: 'Không tìm thấy phòng nào cho khách sạn này!'
                })
            }

            const occupiedRooms = await Room.countDocuments({
                hotelId,
                status: 'occupied'
            })

            const availableRooms = await Room.countDocuments({
                hotelId,
                status: 'available'
            })

            const occupiedRate = totalRooms > 0
                ? ((occupiedRooms / totalRooms) * 100).toFixed(2)
                : 0

            const activeBookings = await Booking.find({
                hotelId,
                status: 'CheckIn'
            }).populate('roomId', 'name type')

            res.status(200).json({
                hotelId,
                occupancy: {
                    totalRooms,
                    occupiedRooms,
                    availableRooms,
                    occupancyRate: parseFloat(occupiedRate),
                    maintenanceRooms: totalRooms - occupiedRooms - availableRooms
                },
                activeBookings: activeBookings.map(booking => ({
                    bookingId: booking.bookingId,
                    room: booking.roomId,
                    checkinDate: booking.checkinDate,
                    checkOutDate: booking.checkOutDate
                })),
                message: 'Lấy thông tin occupancy thành công!'
            })
        } catch(err) {
            return res.status(500).json({ message: err.message })
        }
    }

     async getOccupiedRoomCount(req, res) {
        const { hotelId } = req.params
        
        try {
            const occupiedCount = await Room.countDocuments({ 
                hotelId, 
                status: 'occupied' 
            })

            res.status(200).json({
                hotelId,
                occupiedRoomCount: occupiedCount,
                message: 'Lấy số phòng occupied thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

module.exports = new roomController()
