const cron = require('node-cron')
const Booking = require('../models/booking')
const Room = require('../models/room')

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date()

        const checkInBookings = await Booking.find({
            checkinDate: { $lte: now },
            checkOutDate: { $gt: now },
            status: 'Booked'
        })

        for (let booking of checkInBookings) {
            booking.status = 'CheckIn'
            await booking.save()

            if (booking.roomId) {
                await Room.findByIdAndUpdate(booking.roomId, { status: 'occupied' })
            }
        }

        const expiredBookings = await Booking.find({
            checkOutDate: { $lte: now },
            status: { $in: ['Booked', 'CheckIn'] }
        })

        for (let booking of expiredBookings) {
            booking.status = 'Completed'
            await booking.save()

            if (booking.roomId) {
                await Room.findByIdAndUpdate(booking.roomId, { status: 'available' })
            }
        }

        if (checkInBookings.length > 0) {
            console.log(`Đã cập nhật ${checkInBookings.length} booking sang trạng thái CheckIn.`)
        }
        
        if (expiredBookings.length > 0) {
            console.log(`Đã giải phóng ${expiredBookings.length} phòng hết hạn.`)
        }
    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái phòng:', err)
    }
})