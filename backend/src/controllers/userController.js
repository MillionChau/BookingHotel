const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const changeUserPassword = async (req, res) => {
    const { userId } = req.params
    const { password, newPassword, validPassword } = req.body

    try {
        const user = await User.findOne({ userId })
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(isPasswordValid !== password)
            return res.status(401).json({ message: 'Mật khẩu không đúng!'})

        if(newPassword !== validPassword)
            return res.status(401).json({ message: 'Mật khẩu không trùng nhau!' })

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = newPassword.hashedPassword
        await user.save()

        res.status(200).json({ message: 'password is updated!' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const updateUserInfo = async (req, res) => {
    const userId = req.params
    const { fullname, email, phone, address } = req.body

    try {
        const user = User.findOne(userId)
        if(!user)
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' })

        user.fullname = fullname
        user.email = email
        user.phone = phone
        user.address = address

        await user.save()
        res.status(200).json({ message: 'Thay đổi thông tin thành công!'})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { changeUserPassword, updateUserInfo }