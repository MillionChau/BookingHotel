const hotelController = require('../../controllers/hotelController')
const Hotel = require('../../models/hotel')

// Mock Mongoose model
jest.mock('../../models/hotel')

describe('Hotel Controller - Unit Test', () => {
  let req, res

  beforeEach(() => {
    req = { body: {}, params: {} }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    jest.clearAllMocks()
  })

  // TC-06: Tạo khách sạn thành công
  it('TC-06: should create hotel successfully', async () => {
    req.body = { name: 'Hotel A', address: '1-Đường A-Hà Nội' }
    Hotel.countDocuments.mockResolvedValue(0)
    Hotel.prototype.save = jest.fn().mockResolvedValue(true)

    await hotelController.createHotel(req, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Thêm khách sạn thành công!'
    }))
  })

  // TC-07: Thiếu trường dữ liệu
  it('TC-07: should return 400 if missing name/address', async () => {
    req.body = { name: '', address: '' }

    await hotelController.createHotel(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.any(String)
    }))
  })

  // TC-08: Lấy tất cả khách sạn
  it('TC-08: should get all hotels', async () => {
    Hotel.find.mockResolvedValue([{ name: 'H1' }])

    await hotelController.getAllHotel(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      HotelList: expect.any(Array)
    }))
  })

  // TC-09: Lấy khách sạn theo ID
  it('TC-09: should get hotel by id', async () => {
    req.params.hotelId = 'HT-2025-0001'
    Hotel.findOne.mockResolvedValue({ hotelId: 'HT-2025-0001' })

    await hotelController.getHotelById(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      hotel: expect.any(Object)
    }))
  })

  // TC-10: Tìm khách sạn không tồn tại
  it('TC-10: should return 404 if hotel not found when getting ', async () => {
    req.params.hotelId = 'NOT-FOUND'
    Hotel.findOne.mockResolvedValue(null)

    await hotelController.getHotelById(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })


  // TC-11: Chỉnh sửa khách sạn
  it('TC-11: should update hotel successfully', async () => {
    req.params.hotelId = 'HT-2025-0001'
    req.body = { name: 'New Hotel', address: '12-Đường B-Hà Nội' }
    const fakeHotel = { save: jest.fn() }
    Hotel.findOne.mockResolvedValue(fakeHotel)

    await hotelController.updateHotel(req, res)

    expect(fakeHotel.save).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Chỉnh sửa thông tin khách sạn thành công!' })
  })

  // TC-12: Chỉnh sửa khách sạn không tồn tại
  it('TC-12: should return 404 if hotel not found when updating', async () => {
    req.params.hotelId = 'NOT-FOUND'
    Hotel.findOne.mockResolvedValue(null)

    await hotelController.updateHotel(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  // TC-13: Xoá khách sạn tồn tại
  it('TC-13: should delete hotel successfully', async () => {
    req.params.hotelId = 'HT-2025-0001'
    Hotel.findOne.mockResolvedValue([{}])
    Hotel.deleteOne.mockResolvedValue({})

    await hotelController.deleteHotel(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Xoá khách sạn thành công!' })
  })

  // TC-14: Xoá khách sạn không tồn tại
  it('TC-14: should return 404 if hotel not found when deleting', async () => {
    req.params.hotelId = 'NOT-FOUND'
    Hotel.findOne.mockResolvedValue(null)

    await hotelController.deleteHotel(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })
})
