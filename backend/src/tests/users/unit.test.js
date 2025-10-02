const userController = require('../../controllers/userController')
const bcrypt = require('bcryptjs')
const User = require('../../models/user')

jest.mock('../../models/user')
jest.mock('bcryptjs')

describe('User Controller - Unit Test', () => {
    let req, res
    beforeEach(() => {
        req = { body: {}, params: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        jest.clearAllMocks()
    })

    // TC-31: Lấy danh sách tất cả người dùng
    it('TC-31: should get all user', async () => {
        const userData = [
            {
                userId: "US-2025-0001",
                fullname: "Nguyễn Văn An",
                email: "nguyenvanan@example.com",
                password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjz87jmTqYne", // password: 123456
                phone: "0912345678",
                address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
                role: "Customer",
                createAt: new Date("2024-01-15T08:30:00Z")
            },
            {
                userId: "US-2025-0002",
                fullname: "Trần Thị Bình",
                email: "tranthibinh@example.com",
                password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPjz87jmTqYne", // password: 123456
                phone: "0923456789",
                address: "456 Đường Nguyễn Huệ, Quận 1, TP.HCM",
                role: "Admin",
                createAt: new Date("2024-01-16T09:15:00Z")
            }
        ]

        User.find.mockResolvedValue(userData)
        await userController.getAllUserInfo(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Lấy danh sách người dùng thành công!',
            users: userData
        }))
    })

    // TC-32: Sửa mật khẩu hợp lệ
    it('TC-32: should change password successfully when valid', async () => {
        req.params.userId = 'U1' 
        req.body = { 
            password: 'oldPass', 
            newPassword: 'newPass123', 
            validPassword: 'newPass123' 
        } 
        const mockUser = { 
            userId: 'U1', 
            password: 'hashedOld', 
            save: jest.fn().mockResolvedValue(true) 
        } 
        User.findOne.mockResolvedValue(mockUser) 
        
        bcrypt.compare.mockResolvedValue(true) 
        bcrypt.hash.mockResolvedValue('hashedNew')

        await userController.changeUserPassword(req, res) 
        
        expect(User.findOne).toHaveBeenCalledWith({ userId: 'U1' }) 
        expect(bcrypt.compare).toHaveBeenCalledWith('oldPass', 'hashedOld') 
        expect(bcrypt.hash).toHaveBeenCalledWith('newPass123', 12) 
        expect(mockUser.password).toBe('hashedNew') 
        expect(mockUser.save).toHaveBeenCalled() 
        expect(res.status).toHaveBeenCalledWith(200) 
        expect(res.json).toHaveBeenCalledWith({ message: 'Cập nhật mật khẩu thành công!' }) 
    })

    // TC-33: Sửa mật khẩu không hợp lệ
    it('TC-33: shuold change password fail when not valid', async () => {
        req.params.userId = 'U1'; 
        req.body = { password: 'oldPass', 
            newPassword: 'abc', 
            validPassword: 'xyz' 
        }; 
        
        const mockUser = { 
            userId: 'U1', 
            password: 'hashedOld' 
        }; 
        
        User.findOne.mockResolvedValue(mockUser); 
        bcrypt.compare.mockResolvedValue(true); 
        
        await userController.changeUserPassword(req, res); 
        
        expect(res.status).toHaveBeenCalledWith(401); 
        expect(res.json).toHaveBeenCalledWith({ message: 'Mật khẩu không trùng nhau!' });
    })

    // TC-34: Chỉnh sửa người dùng tồn tại
    it('TC-34: should return 200 if updating user successfully', async () => {
        req.params.userId = 'CT25-4568-0001'
        req.body = {
            fullname: 'update user',
            address: '12-Đường B-Hà Nội'
        }

        const fakeUser = { save: jest.fn() }

        User.findOne.mockResolvedValue(fakeUser)

        await userController.updateUserInfo(req, res)

        expect(fakeUser.save).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Thay đổi thông tin thành công!'
        })
    })

    // TC-35: CHỉnh sửa thông tin người dùng không tồn tại
    it('TC-35: should return 404 if user not found when updating', async () => {
        req.params.userId = 'NOT-FOUND'
        User.findOne.mockResolvedValue(null)
        
        await userController.updateUserInfo(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Không tìm thấy người dùng!'
        })
    })

    // TC-36: Lấy người dùn theo ID
    it('TC-36: should get user by id', async () => {
        req.params.userId = 'CT25-4568-0001'
        User.findOne.mockResolvedValue({ userId: 'CT25-4568-0001' })

        await userController.getUserInfo(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.any(Object)
        }))
    })
})