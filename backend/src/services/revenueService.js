const Revenue = require('../models/revenue')

class revenueService {
    async updateRevenue(booking) {
        try {
            let paymentDate
            if (booking.paymentDay) {
                paymentDate = new Date(booking.paymentDay)
                paymentDate = new Date(paymentDate.getTime() + paymentDate.getTimezoneOffset() * 60000)
            } else {
                paymentDate = new Date()
            }
            
            const month = paymentDate.getMonth() + 1
            const year = paymentDate.getFullYear()

            console.log(`Processing revenue for: Hotel ${booking.hotelId}, Month: ${month}, Year: ${year}`)

            let revenue = await Revenue.findOne({
                hotelId: booking.hotelId,
                month: month,
                year: year
            })

            if (revenue) {
                revenue.totalPrice += booking.totalPrice
                revenue.bookingCount += 1
                revenue.updatedAt = new Date()
                await revenue.save()
            } else {
                const revenueId = await this.generateRevenueId(booking.hotelId, month, year)
                revenue = new Revenue({
                    revenueId,
                    hotelId: booking.hotelId,
                    month,
                    year,
                    totalPrice: booking.totalPrice,
                    bookingCount: 1
                })
                await revenue.save()
            }
    
            return revenue
        } catch (error) {
            console.error('Error updating revenue:', error)
            throw error
        }
    }

    async getHotelRevenue(hotelId, month, year) {
        try {
            let query = { hotelId }
            
            if (month) query.month = parseInt(month)
            if (year) query.year = parseInt(year)

            return await Revenue.find(query).sort({ year: 1, month: 1 })
        } catch (error) {
            console.error('Error getting hotel revenue:', error)
            throw error
        }
    }

    async getMonthlyRevenue(month, year) {
        try {
            let query = {}
            
            if (month) query.month = parseInt(month)
            if (year) query.year = parseInt(year)

            return await Revenue.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: { month: "$month", year: "$year" },
                        totalRevenue: { $sum: "$totalPrice" },
                        totalBookings: { $sum: "$bookingCount" },
                        hotelCount: { $sum: 1 }
                    }
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } }
            ])
        } catch (error) {
            console.error('Error getting monthly revenue:', error)
            throw error
        }
    }

    async getAllRevenueStats() {
        try {
            return await Revenue.aggregate([
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$totalPrice" },
                        totalBookings: { $sum: "$bookingCount" },
                        uniqueHotels: { $addToSet: "$hotelId" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalRevenue: 1,
                        totalBookings: 1,
                        hotelCount: { $size: "$uniqueHotels" }
                    }
                }
            ])
        } catch (error) {
            console.error('Error getting revenue stats:', error)
            throw error
        }
    }

    async generateRevenueId(hotelId, month, year) {
        const monthStr = month.toString().padStart(2, '0')
        return `REV-${hotelId}-${year}${monthStr}`
    }
}

module.exports = new revenueService()