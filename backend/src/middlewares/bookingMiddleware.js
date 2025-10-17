const RevenueService = require('../services/revenueService')

const bookingMiddleware = {
  async updateRevenueOnPayment(doc) {
    if (doc.paymentStatus === 'Paid') {
      try {
        await RevenueService.updateRevenue(doc)
        console.log('Revenue updated for booking:', doc.bookingId)
      } catch (error) {
        console.error('Revenue update failed:', error)
      }
    }
  }
}

module.exports = bookingMiddleware