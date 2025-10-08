// cypress/e2e/user_features.cy.js

describe('Tính năng Người dùng - E2E Test', () => {
  const userCredentials = {
    email: 'testuser@example.com',
    password: 'password123',
    fullname: 'Nguyễn Văn Test'
  };

  beforeEach(() => {
    cy.clearLocalStorage();
  });

  describe('Đăng ký tài khoản', () => {
    it('Đăng ký tài khoản mới thành công', () => {
      cy.intercept('POST', '**/auth/register', {
        statusCode: 201,
        body: { message: 'Register successful' }
      }).as('registerRequest');

      cy.visit('/register');

      cy.get('input[type="text"]').first().type(userCredentials.fullname);
      cy.get('input[type="email"]').type(userCredentials.email);
      cy.get('input[type="password"]').first().type(userCredentials.password);
      cy.get('input[type="password"]').last().type(userCredentials.password);

      cy.get('button').contains('REGISTER').click();

      cy.wait('@registerRequest');
      cy.contains('Register successful! Redirecting to login...').should('be.visible');
    });

    it('Hiển thị lỗi khi mật khẩu không khớp', () => {
      cy.visit('/register');

      cy.get('input[type="text"]').first().type(userCredentials.fullname);
      cy.get('input[type="email"]').type(userCredentials.email);
      cy.get('input[type="password"]').first().type(userCredentials.password);
      cy.get('input[type="password"]').last().type('differentpassword');

      cy.get('button').contains('REGISTER').click();

      cy.contains('Passwords do not match.').should('be.visible');
    });
  });

  describe('Đăng nhập hệ thống', () => {
    it('Đăng nhập thành công với vai trò Customer', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token',
          user: {
            id: 'user123',
            fullname: userCredentials.fullname,
            email: userCredentials.email,
            role: 'Customer'
          }
        }
      }).as('loginRequest');

      cy.visit('/login');

      cy.get('input[type="email"]').type(userCredentials.email);
      cy.get('input[type="password"]').type(userCredentials.password);

      cy.get('button').contains('LOGIN').click();

      cy.wait('@loginRequest');
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Hiển thị lỗi khi đăng nhập thất bại', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid credentials' }
      }).as('failedLogin');

      cy.visit('/login');

      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpassword');

      cy.get('button').contains('LOGIN').click();

      cy.wait('@failedLogin');
      cy.contains('Invalid credentials').should('be.visible');
    });
  });

  describe('Quản lý hồ sơ cá nhân', () => {
    beforeEach(() => {
      // Mock API cho profile
      cy.intercept('GET', '**/user/user-info/*', {
        statusCode: 200,
        body: {
          user: {
            id: 'user123',
            fullname: userCredentials.fullname,
            email: userCredentials.email,
            phone: '0123456789',
            address: 'Hà Nội',
            role: 'Customer'
          }
        }
      }).as('getUserInfo');

      cy.loginAsCustomer();
      cy.visit('/profile');
      cy.wait('@getUserInfo');
    });

    it('Hiển thị thông tin cá nhân đúng cách', () => {
      cy.contains('Thông tin cá nhân').should('be.visible');
      cy.contains(userCredentials.fullname).should('be.visible');
      cy.contains(userCredentials.email).should('be.visible');
      cy.contains('Chỉnh sửa').should('be.visible');
    });

    it('Chuyển sang chế độ chỉnh sửa thông tin', () => {
      cy.contains('button', 'Chỉnh sửa').click();

      cy.get('input[name="fullname"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="phone"]').should('be.visible');
      cy.get('input[name="address"]').should('be.visible');
      
      cy.contains('Lưu').should('be.visible');
      cy.contains('Quay lại').should('be.visible');
    });

    it('Cập nhật thông tin cá nhân thành công', () => {
      cy.intercept('PUT', '**/user/update-user/*', {
        statusCode: 200,
        body: { message: 'User updated successfully' }
      }).as('updateProfile');

      cy.contains('button', 'Chỉnh sửa').click();

      cy.get('input[name="fullname"]').clear().type('Nguyễn Văn Updated');
      cy.get('input[name="phone"]').clear().type('0912345678');
      cy.get('input[name="address"]').clear().type('Hà Nội, Việt Nam');

      cy.contains('button', 'Lưu').click();

      cy.wait('@updateProfile');
      cy.contains('Cập nhật thông tin thành công!').should('be.visible');
    });

    it('Hiển thị lịch sử đặt phòng', () => {
      cy.contains('Lịch sử đặt phòng').should('be.visible');
      cy.get('table').should('be.visible');
      cy.get('thead').contains('Khách sạn').should('be.visible');
      cy.get('thead').contains('Phòng').should('be.visible');
    });
  });

  describe('Quản lý đặt phòng', () => {
    beforeEach(() => {
      cy.loginAsCustomer();
    });

    it('Tìm kiếm khách sạn thành công', () => {
      cy.intercept('GET', '**/hotel/all', {
        statusCode: 200,
        body: {
          HotelList: [
            {
              hotelId: 'H001',
              name: 'Khách sạn Test',
              address: 'Hà Nội',
              price: 1000000,
              rating: 4.5,
              imageUrl: 'https://example.com/hotel1.jpg'
            }
          ]
        }
      }).as('getHotels');

      cy.intercept('GET', '**/favorite/user/*', {
        statusCode: 200,
        body: []
      }).as('getFavorites');

      cy.visit('/BookingHotel');

      cy.get('input[placeholder*="Ví dụ: Hà Nội"]').type('Hà Nội');
      cy.get('button').contains('Tìm Kiếm').click();

      cy.wait(['@getHotels', '@getFavorites']);
      cy.contains('Kết quả tìm kiếm').should('be.visible');
    });

    it('Xem chi tiết khách sạn', () => {
      cy.intercept('GET', '**/hotel/H001', {
        statusCode: 200,
        body: {
          hotel: {
            hotelId: 'H001',
            name: 'Khách sạn Test',
            address: '123 Đường Test, Hà Nội',
            rating: 4.5,
            imageUrl: 'https://example.com/hotel1.jpg',
            description: 'Khách sạn tuyệt vời'
          }
        }
      }).as('getHotelDetail');

      cy.intercept('GET', '**/room/hotel/H001', {
        statusCode: 200,
        body: {
          rooms: [
            {
              roomId: 'R001',
              name: 'Phòng Deluxe',
              type: 'Deluxe',
              price: 1500000,
              status: 'available',
              imageUrl: 'https://example.com/room1.jpg'
            }
          ]
        }
      }).as('getRooms');

      cy.visit('/HotelDetail/H001');

      cy.wait(['@getHotelDetail', '@getRooms']);
      
      cy.contains('Khách sạn Test').should('be.visible');
      cy.contains('Deluxe').should('be.visible');
    });
  });

  describe('Quản lý yêu thích', () => {
    beforeEach(() => {
      cy.loginAsCustomer();
    });

    it('Xem danh sách yêu thích', () => {
      cy.intercept('GET', '**/favorite/user/*', {
        statusCode: 200,
        body: [
          {
            _id: 'fav123',
            hotelId: 'H001',
            userId: 'user123'
          }
        ]
      }).as('getFavorites');

      cy.intercept('GET', '**/hotel/H001', {
        statusCode: 200,
        body: {
          hotel: {
            hotelId: 'H001',
            name: 'Khách sạn Test',
            address: 'Hà Nội',
            imageUrl: 'https://example.com/hotel1.jpg'
          }
        }
      }).as('getHotel');

      cy.visit('/favoriteList');

      cy.wait(['@getFavorites', '@getHotel']);
      cy.contains('Danh sách yêu thích').should('be.visible');
    });
  });

  describe('Lịch sử đặt phòng & Đánh giá', () => {
    beforeEach(() => {
      cy.loginAsCustomer();
    });

    it('Xem lịch sử đặt phòng', () => {
      cy.intercept('GET', '**/booking/user/*', {
        statusCode: 200,
        body: {
          bookings: [
            {
              _id: 'booking123',
              hotelId: 'H001',
              roomId: 'R001',
              checkinDate: '2024-12-25',
              checkOutDate: '2024-12-26',
              totalPrice: 1500000,
              status: 'Completed',
              hotel: { name: 'Khách sạn Test' },
              room: { name: 'Phòng Deluxe' }
            }
          ]
        }
      }).as('getBookings');

      // Mock API cho hotel và room
      cy.intercept('GET', '**/hotel/H001', {
        statusCode: 200,
        body: {
          hotel: {
            hotelId: 'H001',
            name: 'Khách sạn Test'
          }
        }
      }).as('getHotel');

      cy.intercept('GET', '**/room/R001', {
        statusCode: 200,
        body: {
          room: {
            roomId: 'R001',
            name: 'Phòng Deluxe'
          }
        }
      }).as('getRoom');

      cy.visit('/bookingList');

      cy.wait('@getBookings');
      cy.contains('Lịch sử đặt phòng').should('be.visible');
    });

    it('Xem lịch sử đánh giá', () => {
      cy.intercept('GET', '**/review/user/*', {
        statusCode: 200,
        body: {
          reviews: [
            {
              _id: 'review123',
              rating: 5,
              content: 'Phòng rất tuyệt vời',
              hotelName: 'Khách sạn Test',
              roomName: 'Phòng Deluxe'
            }
          ]
        }
      }).as('getReviews');

      cy.visit('/danh-gia');

      cy.contains('button', 'Lịch sử đánh giá').click();

      cy.wait('@getReviews');
      cy.get('.modal').should('be.visible');
      cy.contains('Lịch sử đánh giá').should('be.visible');
    });
  });

  describe('Điều hướng và bảo vệ route', () => {
    it('Tự động chuyển hướng đến login khi truy cập route protected chưa đăng nhập', () => {
      cy.visit('/profile');
      cy.url().should('include', '/login');
    });

    it('Không thể truy cập admin dashboard với vai trò Customer', () => {
      cy.loginAsCustomer();
      cy.visit('/dashboard');
      cy.url().should('not.include', '/dashboard');
    });

    it('Truy cập được các trang public khi chưa đăng nhập', () => {
      cy.visit('/');
      cy.contains('Đặt phòng khách sạn dễ dàng').should('be.visible');

      cy.visit('/BookingHotel');
      cy.get('input[placeholder*="Ví dụ: Hà Nội"]').should('be.visible');
    });
  });
});

// Custom commands
Cypress.Commands.add('loginAsCustomer', () => {
  const user = {
    id: 'user123',
    fullname: 'Nguyễn Văn Test',
    email: 'testuser@example.com',
    role: 'Customer'
  };
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', 'fake-customer-token');
});

Cypress.Commands.add('loginAsAdmin', () => {
  const user = {
    id: 'admin123',
    fullname: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin'
  };
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', 'fake-admin-token');
});