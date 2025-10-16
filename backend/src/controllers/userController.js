const User = require('../models/user')
const bcrypt = require('bcryptjs')

class userController {

    async changeUserPassword(req, res) {
        const { userId } = req.params
        const { password, newPassword, validPassword } = req.body

        try {
            const user = await User.findOne({ userId })
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng!' })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid)
                return res.status(401).json({ message: 'Mật khẩu không đúng!' })

            if (newPassword !== validPassword)
                return res.status(401).json({ message: 'Mật khẩu không trùng nhau!' })

            const hashedPassword = await bcrypt.hash(newPassword, 12);

            user.password = hashedPassword
            await user.save()

            res.status(200).json({ message: 'Cập nhật mật khẩu thành công!' })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async updateUserInfo(req, res) {
        const { userId } = req.params
        const { fullname, email, phone, address } = req.body

        try {
            const user = await User.findOne({ userId })
            if (!user)
                return res.status(404).json({ message: 'Không tìm thấy người dùng!' })

            user.fullname = fullname
            user.email = email
            user.phone = phone
            user.address = address

            await user.save()
            res.status(200).json({ message: 'Thay đổi thông tin thành công!' })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async getUserInfo(req, res) {
        const { userId } = req.params

        try {
            const user = await User.findOne({ userId })

            if (!user)
                return res.status(404).json({ message: 'Người dùng không tồn tại!' })

            res.status(200).json({
                user: user,
                message: 'Lấy thành công thông tin user'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async getAllUserInfo(req, res) {
        try {
            const users = await User.find()

            if (!users || users.length === 0)
                return res.status(404).json({ message: 'Không có người dùng' })

            res.status(200).json({
                users: users,
                message: 'Lấy danh sách người dùng thành công!'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }

    async deleteUser(req, res) {
        const { userId } = req.params

        try {
            const user = User.find({ userId })

            if (!user)
                return res.status(404).json({ message: 'Không có người dùng' })

            await User.deleteOne(user)

            res.status(200).json({
                message: 'Xoá người dùng thành công!'
            })

        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
}


module.exports = new userController