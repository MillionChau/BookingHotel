const Room = require('../models/room')

class roomController {
    async createRoom(req, res) {
        const { hotelId, name, price, capacity, description } = req.body
        try {
            const room = new Room({ hotelId, name, price, capacity, description })
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
        const { name, price, capacity, description } = req.body
        try {
            const room = await Room.findById(id)
            if (!room) return res.status(404).json({ message: 'Không tìm thấy phòng!' })

            room.name = name || room.name
            room.price = price || room.price
            room.capacity = capacity || room.capacity
            room.description = description || room.description

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