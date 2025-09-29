const revenueController = require('../../controllers/revenueController')
const Revenue = require('../../models/revenue')
const revenueService = require('../../services/revenueService')

jest.mock('../../models/revenue')
jest.mock('../../services/revenueService')

describe('Revenue Controller - Unit Test', () => {
    let req, res

    beforeEach(() => {
        req = { params: {}, query: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        jest.clearAllMocks()
    })

    // TC-45: Lấy doanh thu theo khách sạn
    it('TC-45: should get revenue by hotel successfully', async () => {
        const mockRevenues = [
            {
                hotelId: 'HT-0001',
                month: 11,
                year: 2024,
                totalPrice: 5000000,
                bookingCount: 10
            }
        ]

        req.params = { hotelId: 'HT-0001' }
        req.query = { month: '11', year: '2024' }

        revenueService.getHotelRevenue.mockResolvedValue(mockRevenues)

        await revenueController.getRevenueByHotel(req, res)

        expect(revenueService.getHotelRevenue).toHaveBeenCalledWith('HT-0001', '11', '2024')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Lấy doanh thu khách sạn thành công!',
            data: {
                hotelId: 'HT-0001',
                revenues: mockRevenues,
                totalRevenue: 5000000,
                totalBookings: 10
            }
        })
    })

    // TC-46: Lấy doanh thu theo tháng
    it('TC-46: should get monthly revenue successfully', async () => {
        const mockMonthlyRevenue = [
            {
                hotelId: 'HT-0001',
                month: 11,
                year: 2024,
                totalRevenue: 5000000,
                totalBookings: 10
            },
            {
                hotelId: 'HT-0002',
                month: 11,
                year: 2024,
                totalRevenue: 3000000,
                totalBookings: 8
            }
        ]

        req.query = { month: '11', year: '2024' }

        revenueService.getMonthlyRevenue.mockResolvedValue(mockMonthlyRevenue)

        await revenueController.getMonthlyRevenue(req, res)

        expect(revenueService.getMonthlyRevenue).toHaveBeenCalledWith('11', '2024')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Lấy doanh thu theo tháng thành công!',
            data: {
                monthlyRevenue: mockMonthlyRevenue,
                totalRevenue: 8000000,
                totalBookings: 18
            }
        })
    })
})