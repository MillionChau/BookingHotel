const roomController = require('../../controllers/roomController')
const Room = require('../../models/room')
const Hotel = require('../../models/hotel')

jest.mock('../../models/room')
jest.mock('../../models/hotel')

describe('Room Controller - Unit Test', () => {
    let req, register
    beforeEach(() => {
        req = { body: {}, params: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        jest.clearAllMocks()
    })

    // TC-15: Thêm phòng thành công
    it('TC-15: should create room successfully', async () => {
        req.body = { roomId: 'TNHD-P201', hotelId: 'TCHS-HS-2073', name: 'Test Hotel', price: 500000, type: 'SVIP', status: '' }
        Room.countDocuments.mockResolvedValue(0)
        Room.prototype.save = jest.fn().mockResolvedValue(true)

        Hotel.findOne.mockResolvedValue({
            hotelId: 'TCHS-HS-2073',
            name: 'Test Hotel'
        })

        await roomController.createRoom(req, res)

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    // TC-16: Thêm phòng thiếu trường dữ liệu
    it('TC-16: should return 400 if missing hotelId/name', async () => {
        res.body = { roomId: 'TNHD-P201', hotelId: '', name: '', price: 500000, type: 'SVIP', status: '' }
        await roomController.createRoom(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    // TC-17: thêm phòng trong khách sạn không tồn tại
    it('TC-17: should return 404 if hotelId not found', async () => {
        req.body = { hotelId: 'NOT_EXIST', name: 'P101', price: 200000, type: 'VIP' }

        Hotel.findOne.mockResolvedValue(null)

        await roomController.createRoom(req, res)

        expect(Hotel.findOne).toHaveBeenCalledWith({ hotelId: 'NOT_EXIST' })
        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    // TC-18: Lấy danh sách tất cả các phòng
    it('TC-18: should get all rooms successfully', async () => {
        const mockRooms = [
            { roomId: 'H1-R101', hotelId: 'HTDG-123', name: 'Deluxe', type: 'Double', price: 100, status: 'available' },
            { roomId: 'H1-R102', hotelId: 'HTDG-124', name: 'Suite', type: 'Single', price: 150, status: 'occupied' }
        ]

        Room.find.mockResolvedValue(mockRooms)

        await roomController.getAllRoom(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
            rooms: expect.any(Array)
        }))
    })

    // TC-19: Lấy danh sách phòng theo khách sạn
    it('TC-19: should get rooms by hotelId successfully', async () => {
        const mockRooms = [
            { roomId: 'H1-R101', hotelId: 'HTDG-123', name: 'Deluxe', type: 'Double', price: 100, status: 'available' },
            { roomId: 'H1-R102', hotelId: 'HTDG-124', name: 'Suite', type: 'Single', price: 150, status: 'occupied' }
        ]

        Room.find.mockResolvedValue(mockRooms)

        req.params.hotelId = 'HTDG-123'

        await roomController.getRoomsByHotel(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
            rooms: expect.any(Array)
        }))
    })

    // Lấy phòng theo ID
    it('TC-20: should get room by id successfully', async () => {
        const mockRoom = {
            roomId: 'H1-R101',
            hotelId: 'HTDG-123',
            name: 'Deluxe',
            type: 'Double',
            price: 100,
            status: 'available'
        }

        Room.findOne.mockResolvedValue(mockRoom)

        req.params.roomId = 'H1-R101'

        await roomController.getRoomById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String),
            room: expect.any(Object)
        }))
    })

    // TC-21: Xoá phòng thành công
    it('TC-21: should delete room by roomId successfully', async () => {
        const mockRoom = {
            roomId: 'H1-R101',
            hotelId: 'HTDG-123',
            name: 'Deluxe',
            type: 'Double',
            price: 100,
            status: 'available'
        }

        Room.findOne.mockResolvedValue(mockRoom)
        Room.deleteOne.mockResolvedValue({ deletedCount: 1 })

        req.params.roomId = 'H1-R101'

        await roomController.deleteRoom(req, res)

        expect(Room.findOne).toHaveBeenCalledWith({ roomId: 'H1-R101' })
        expect(Room.deleteOne).toHaveBeenCalledWith(mockRoom)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.any(String)
        }))
    })

    it('TC-22: should return 404 if delete room not found', async () => {
        req = { params: { roomId: 'NOT-FOUND' } }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        Room.findOne.mockResolvedValue(null)

        await roomController.deleteRoom(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({ message: 'Không tìm thấy phòng!' })
    })

    it('TC-23: should update room successfully', async () => {
        const mockRoom = {
            roomId: 'H1-R101',
            name: 'Deluxe',
            type: 'Double',
            price: 100,
            status: 'available',
            imageUrl: 'img.jpg',
            save: jest.fn()
        }

        req = {
            params: { roomId: 'H1-R101' },
            body: { name: 'Deluxe Update', type: 'Triple' }
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        Room.findOne = jest.fn().mockResolvedValue(mockRoom)

        await roomController.updateRoom(req, res)

        expect(Room.findOne).toHaveBeenCalledWith({ roomId: 'H1-R101' })
        expect(mockRoom.save).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            room: mockRoom,
            message: 'Cập nhật thông tin phòng thành công!'
        })
    })
})