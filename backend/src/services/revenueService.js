const Revenue = require('../models/revenue')

class RevenueService {
    async updateRevenue(booking) {
        try {
            const paymentDate = booking.paymentDay || new Date()
            const month = paymentDate.getMonth() + 1
            const year = paymentDate.getFullYear()

            let revenue = await Revenue.findOne({
                hotelId: booking.hotelId,
                month: month,
                year: year
            })

            if (revenue) {
                revenue.totalPrice += booking.totalPrice
                await revenue.save()
            } else {
 
                const revenueId = await this.generateRevenueId(booking.hotelId, month, year)
                revenue = new Revenue({
                    revenueId,
                    hotelId: booking.hotelId,
                    month,
                    year,
                    totalPrice: booking.totalPrice
                })
                await revenue.save()
            }

            return revenue
        } catch (error) {
            console.error('Error updating revenue:', error)
            throw error
        }
    }

    async generateRevenueId(hotelId, month, year) {
        const monthStr = month.toString().padStart(2, '0')
        return `REV-${hotelId}-${year}${monthStr}`
    }
}

module.exports = new RevenueService()