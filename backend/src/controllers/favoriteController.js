const Favorite = require('../models/favorite')

class favoriteController {
    async createFavorite(req, res) {
        const { roomId, userId } = req.body
        try {
            const favorite = new Favorite({ userId, roomId })
            await favorite.save()
            res.status(201).json({
                favorite,
                message: 'Đã thêm vào danh sách yêu thích'
            })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    }
    async removeFavorite(req, res) {
        const { favoriteId } = req.params
        try {
            await Favorite.findByIdAndDelete(favoriteId)
            res.status(200).json({ message: "Đã xóa khỏi yêu thích" })
        } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err })
        }
    }
    async getUserFavorites(req, res) {
        const { userId } = req.params
        try {
            const favorites = await Favorite.find({ userId }).populate("roomId")
            res.status(200).json(favorites)
        } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err })
        }
    }
    async checkFavorite(req, res) {
        const { userId, roomId } = req.query
        try {
            const favorite = await Favorite.findOne({ userId, roomId })
            if (favorite) {
                res.status(200).json({ isFavorite: true, favoriteId: favorite._id })
            } else {
                res.status(200).json({ isFavorite: false })
            }
        } catch (err) {
            res.status(500).json({ message: "Lỗi server", error: err })
        }
    }
}


module.exports = new favoriteController
