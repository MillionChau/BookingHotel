const authController = require('../../controllers/authController')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Mock toàn bộ dependency
jest.mock('../../models/user')
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

describe('Auth Controller - Unit Test', () => {
  let req, res

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    jest.clearAllMocks()
    process.env.JWT_SECRET = 'unit_test_secret'
  })

  // TC-01: Đăng nhập thành công (Customer)
  it('TC-01: should login successfully as Customer', async () => {
    const fakeUser = { userId: 'CT-2025-0001', email: 'test@gmail.com', password: 'hashed', role: 'Customer', fullname: 'Cus' }
    User.findOne.mockResolvedValue(fakeUser)
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('fakeToken')

    req.body = { email: 'test@gmail.com', password: '123456' }

    await authController.loginUser(req, res)

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@gmail.com' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      token: 'fakeToken',
      user: expect.objectContaining({ role: 'Customer' })
    }))
  })

  // TC-02: Đăng nhập thành công (Admin)
  it('TC-02: should login successfully as Admin', async () => {
    const fakeUser = { userId: 'AD-2025-0001', email: 'test@gmail.com', password: 'hashed', role: 'Admin', fullname: 'Admin' }
    User.findOne.mockResolvedValue(fakeUser)
    bcrypt.compare.mockResolvedValue(true)
    jwt.sign.mockReturnValue('fakeToken')

    req.body = { email: 'test@gmail.com', password: 'admin123' }

    await authController.loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({ role: 'Admin' })
    }))
  })

  // TC-03: Thiếu trường dữ liệu khi đăng ký
  it('TC-03: should return 400 if missing fields in register', async () => {
    req.body = { email: '', password: '' }

    await authController.registerUser(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Vui lòng điền đầy đủ thông tin')
    }))
  })

  // TC-04: Email không tồn tại khi login
  it('TC-04: should return 404 if user not found in login', async () => {
    User.findOne.mockResolvedValue(null)

    req.body = { email: 'notfound@example.com', password: '123456' }

    await authController.loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Không tìm thấy người dùng')
    }))
  })

  // TC-05: Sai mật khẩu khi login
  it('TC-05: should return 401 if password is wrong', async () => {
    const fakeUser = { userId: 'CT-2025-0002', email: 'test@example.com', password: 'hashed', role: 'Customer' }
    User.findOne.mockResolvedValue(fakeUser)
    bcrypt.compare.mockResolvedValue(false)

    req.body = { email: 'test@example.com', password: 'badpass' }

    await authController.loginUser(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Mật khẩu không đúng')
    }))
  })
})
