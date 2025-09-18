const Revenue = require('../models/revenue')
const revenueService = require('../services/revenueService')

class revenueController {
    async getRevenueByHotel(req, res) {
        const { hotelId } = req.params
        const { month, year } = req.query

        try {
            const revenues = await revenueService.getHotelRevenue(hotelId, month, year)

            res.status(200).json({
                message: 'Lấy doanh thu khách sạn thành công!',
                data: {
                    hotelId,
                    revenues: revenues,
                    totalRevenue: revenues.reduce((sum, rev) => sum + rev.totalPrice, 0),
                    totalBookings: revenues.reduce((sum, rev) => sum + rev.bookingCount, 0)
                }
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getMonthlyRevenue(req, res) {
        const { month, year } = req.query

        try {
            const monthlyRevenue = await RevenueService.getMonthlyRevenue(month, year)

            res.status(200).json({
                message: 'Lấy doanh thu theo tháng thành công!',
                data: {
                    monthlyRevenue: monthlyRevenue,
                    totalRevenue: monthlyRevenue.reduce((sum, rev) => sum + rev.totalRevenue, 0),
                    totalBookings: monthlyRevenue.reduce((sum, rev) => sum + rev.totalBookings, 0)
                }
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getRevenueStats(req, res) {
        try {
            const stats = await revenueService.getAllRevenueStats()
            const overallStats = stats[0] || { totalRevenue: 0, totalBookings: 0, hotelCount: 0 }

            res.status(200).json({
                message: 'Lấy thống kê doanh thu thành công!',
                data: overallStats
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    async getAllRevenue(req, res) {
        const { page = 1, limit = 10, month, year, hotelId } = req.query

        try {
            let query = {}
            
            if (month) query.month = parseInt(month)
            if (year) query.year = parseInt(year)
            if (hotelId) query.hotelId = hotelId

            const options = {
                page: parseInt(page),
                limit: parseInt(limit),
                sort: { year: -1, month: -1, hotelId: 1 }
            }

            const revenues = await Revenue.paginate(query, options)

            res.status(200).json({
                message: 'Lấy tất cả doanh thu thành công!',
                data: revenues
            })
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }
}

module.exports = new revenueController()