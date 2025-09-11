const Room = require('../models/room')

class roomController {
    async createRoom(req, res) {
        const { hotelId, name, type, price, imageUrl, status } = req.body
        try {
            const room = new Room({ hotelId, name, type, price, imageUrl, status })
            await room.save()
            res.status(201).json({
                room,
                message: 'Tạo phòng thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
    async updateRoom(req, res) {
        const { id } = req.params
        const { name, type, price, imageUrl, status } = req.body
        try {
            const room = await Room.findById(id)
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
        const { id } = req.params
        try {
            const room = await Room.findById(id)
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
        const { id } = req.params
        try {
            const room = await Room.findByIdAndDelete(id)
            if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng!' })

            res.status(200).json({ message: 'Xóa phòng thành công!' })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}

module.exports = new roomController()
