const Revenue = require('../models/revenue')
const RevenueService = require('../services/revenueService')

class RevenueController {
    async getRevenueByHotel(req, res) {
        const { hotelId } = req.params
        const { month, year } = req.query

        try {
            let query = { hotelId }
            
            if (month) query.month = parseInt(month)
            if (year) query.year = parseInt(year)

            const revenues = await Revenue.find(query)

            res.status(200).json({
                message: 'Lấy doanh thu thành công!',
                revenues: revenues
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getRevenueByPeriod(req, res) {
        const { month, year } = req.query

        try {
            let query = {}
            
            if (month) query.month = parseInt(month)
            if (year) query.year = parseInt(year)

            const revenues = await Revenue.find(query)

            res.status(200).json({
                message: 'Lấy doanh thu theo kỳ thành công!',
                revenues: revenues
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = new RevenueController()