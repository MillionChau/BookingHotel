const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

class authController {

    async registerUser(req, res) {
        const { fullname, email, password, phone, address, role = 'Customer' } = req.body

        if (!fullname || !email || !password) {
            return res.status(400).json({
                message: 'Vui lòng điền đầy đủ thông tin: Họ tên, Email và Mật khẩu'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Định dạng email không hợp lệ'
            })
        }

        try {
            const existingUser = await User.findOne({ email })

            if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại!' })

            const currentYear = new Date().getFullYear()

            const yearStart = new Date(currentYear, 0, 1)
            const yearEnd = new Date(currentYear + 1, 0, 1)

            const userCount = await User.countDocuments({
                createAt: {
                    $gte: yearStart,
                    $lt: yearEnd
                }
            })

            const sequenceNumber = (userCount + 1).toString().padStart(10, 0)
            const prefix = role === 'Admin' ? 'AD' : 'CT'
            const userId = `${prefix}-${currentYear}-${sequenceNumber}`

            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = new User({
                userId,
                fullname,
                email,
                password: hashedPassword,
                phone,
                address,
                role
            })

            await newUser.save()

            const token = jwt.sign(
                { id: newUser.userId, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            res.status(201).json({
                message: 'Đăng ký thành công!',
                token,
                user: {
                    id: newUser.userId,
                    fullname: newUser.fullname,
                    email: newUser.email,
                    phone: newUser.phone,
                    address: newUser.address,
                    role: newUser.role
                }
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body
        console.log('Login attempt:', { email, password })

        try {
            const user = await User.findOne({ email })
            if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' })

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if (!isPasswordValid)
                res.status(401).json({ message: 'Mật khẩu không đúng, vui lòng nhập lại!' })

            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
                return res.status(500).json({ message: 'Lỗi cấu hình server' });
            }

            const token = jwt.sign(
                { id: user.userId, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            res.status(200).json({
                token,
                user: {
                    id: user.userId,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}


module.exports = new authController