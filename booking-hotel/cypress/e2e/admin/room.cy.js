describe('Quản lý Phòng - E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('http://localhost:3000/rooms');
    cy.intercept('GET', '**/hotel/all').as('getHotels');
    cy.intercept('GET', '**/room/hotel/*').as('getRoomsByHotel');
  });

  it('Hiển thị trang quản lý phòng thành công', () => {
    cy.wait('@getHotels');

    cy.contains('h2', 'Quản lý phòng').should('be.visible');
    cy.get('select').should('be.visible');
    cy.get('table').should('be.visible');
    cy.get('thead').contains('Mã phòng').should('be.visible');
    cy.get('thead').contains('Tên phòng').should('be.visible');
    cy.get('thead').contains('Loại').should('be.visible');
    cy.get('thead').contains('Giá').should('be.visible');
    cy.get('thead').contains('Trạng thái').should('be.visible');
  });

  it('Lọc phòng theo khách sạn', () => {
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        const firstHotel = hotels[0];
        
        cy.get('select').select(firstHotel.hotelId);
        cy.get('select').should('have.value', firstHotel.hotelId);
        
        cy.wait('@getRoomsByHotel');
        
        cy.get('table tbody tr').should('exist');
      }
    });
  });

  it('Hiển thị danh sách phòng khi chọn khách sạn', () => {
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getRoomsByHotel');
        
        cy.get('table tbody tr').should('be.visible');
        cy.get('td').contains('Trống').should('be.visible');
      }
    });
  });

  it('Hiển thị thông tin phòng đúng định dạng', () => {
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getRoomsByHotel').then((roomInterception) => {
          const rooms = roomInterception.response.body.rooms;
          if (rooms && rooms.length > 0) {
            const room = rooms[0];
            
            cy.get('tbody tr').first().within(() => {
              cy.get('td').eq(0).should('contain', room.roomId);
              cy.get('td').eq(1).should('contain', room.name);
              cy.get('td').eq(3).should('contain', '₫');
            });
          }
        });
      }
    });
  });

  it('Thêm phòng mới thành công', () => {
    cy.intercept('POST', '**/room/create').as('createRoom');
    
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        
        cy.contains('button', 'Thêm phòng').click();
        cy.get('.modal').should('be.visible');
        cy.contains('Thêm phòng').should('be.visible');
        
        cy.get('input[type="text"]').eq(1).type('Phòng Suite Test');
        cy.get('input[type="text"]').eq(2).type('Suite');
        cy.get('input[type="number"]').type('2500000');
        cy.get('select').eq(1).select('available');
        cy.get('input[type="text"]').eq(3).type('https://example.com/test.jpg');
        
        cy.contains('button', 'Lưu').click();
        
        cy.wait('@createRoom').then((createInterception) => {
          expect(createInterception.request.body).to.have.property('name', 'Phòng Suite Test');
          expect(createInterception.request.body).to.have.property('price', 2500000);
        });
      }
    });
  });

  it('Sửa thông tin phòng thành công', () => {
    cy.intercept('PUT', '**/room/update/*').as('updateRoom');
    
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getRoomsByHotel').then((roomInterception) => {
          const rooms = roomInterception.response.body.rooms;
          if (rooms && rooms.length > 0) {
            cy.get('tbody tr').first().within(() => {
              cy.contains('button', 'Sửa').click();
            });
            
            cy.get('.modal').should('be.visible');
            cy.contains('Sửa phòng').should('be.visible');
            
            cy.get('input[type="text"]').eq(1).clear().type('Phòng Đã Sửa');
            cy.get('input[type="number"]').clear().type('3000000');
            
            cy.contains('button', 'Lưu').click();
            
            cy.wait('@updateRoom').then((updateInterception) => {
              expect(updateInterception.request.body).to.have.property('name', 'Phòng Đã Sửa');
              expect(updateInterception.request.body).to.have.property('price', 3000000);
            });
          }
        });
      }
    });
  });

  it('Xóa phòng thành công', () => {
    cy.intercept('DELETE', '**/room/delete/*').as('deleteRoom');
    
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getRoomsByHotel').then((roomInterception) => {
          const rooms = roomInterception.response.body.rooms;
          if (rooms && rooms.length > 0) {
            cy.get('tbody tr').first().within(() => {
              cy.contains('button', 'Xóa').click();
            });
            
            cy.on('window:confirm', () => true);
            
            cy.wait('@deleteRoom').then((deleteInterception) => {
              expect(deleteInterception.response.statusCode).to.equal(200);
            });
          }
        });
      }
    });
  });

  it('Hủy thao tác thêm phòng', () => {
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        
        cy.contains('button', 'Thêm phòng').click();
        cy.get('.modal').should('be.visible');
        cy.contains('button', 'Hủy').click();
        cy.get('.modal').should('not.exist');
      }
    });
  });

  it('Hiển thị khi không có phòng nào', () => {
    cy.intercept('GET', '**/room/hotel/*', { rooms: [] }).as('getEmptyRooms');
    
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getEmptyRooms');
        
        cy.contains('Chưa có phòng nào').should('be.visible');
      }
    });
  });

  it('Xử lý lỗi khi tải phòng thất bại', () => {
    cy.intercept('GET', '**/room/hotel/*', { statusCode: 500 }).as('getRoomsError');
    
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getRoomsError');
        
        cy.get('.alert-danger').should('be.visible');
      }
    });
  });

  it('Hiển thị ảnh phòng đúng cách', () => {
    cy.wait('@getHotels').then((interception) => {
      const hotels = interception.response.body.HotelList;
      if (hotels && hotels.length > 0) {
        cy.get('select').select(hotels[0].hotelId);
        cy.wait('@getRoomsByHotel').then((roomInterception) => {
          const rooms = roomInterception.response.body.rooms;
          if (rooms && rooms.length > 0) {
            const room = rooms[0];
            
            cy.get('tbody tr').first().within(() => {
              if (room.imageUrl) {
                cy.get('img').should('have.attr', 'src', room.imageUrl);
                cy.get('img').should('have.attr', 'alt', room.name);
              } else {
                cy.contains('No image').should('be.visible');
              }
            });
          }
        });
      }
    });
  });
});