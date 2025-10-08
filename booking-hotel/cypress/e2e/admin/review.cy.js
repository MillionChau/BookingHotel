describe('Quản lý Đánh giá - E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('http://localhost:3000/review');
    cy.intercept('GET', '**/room/all').as('getRooms');
    cy.intercept('GET', '**/review/all').as('getAllReviews');
    cy.intercept('GET', '**/review/room/*/rating').as('getRoomStats');
  });

  it('Hiển thị trang quản lý đánh giá thành công', () => {
    cy.wait('@getRooms');
    cy.wait('@getAllReviews');

    cy.contains('h2', 'Quản lý đánh giá').should('be.visible');
    cy.get('select').should('be.visible');
    cy.get('table').should('be.visible');
    cy.get('thead').contains('Mã đánh giá').should('be.visible');
    cy.get('thead').contains('Phòng').should('be.visible');
    cy.get('thead').contains('Đánh giá').should('be.visible');
  });

  it('Lọc đánh giá theo phòng', () => {
    cy.wait('@getRooms').then((interception) => {
      const rooms = interception.response.body.rooms;
      if (rooms && rooms.length > 0) {
        const firstRoom = rooms[0];
        
        cy.get('select').select(firstRoom.roomId);
        cy.get('select').should('have.value', firstRoom.roomId);
        
        cy.wait('@getRoomStats');
        
        cy.contains('Thống kê đánh giá').should('be.visible');
        cy.contains('Điểm trung bình').should('be.visible');
        cy.contains('Tổng số đánh giá').should('be.visible');
      }
    });
  });

  it('Hiển thị thống kê khi chọn phòng', () => {
    cy.wait('@getRooms').then((interception) => {
      const rooms = interception.response.body.rooms;
      if (rooms && rooms.length > 0) {
        cy.get('select').select(rooms[0].roomId);
        cy.wait('@getRoomStats');
        
        cy.get('.stats-box').should('be.visible');
        cy.get('.bg-primary').should('be.visible');
        cy.get('.bg-secondary').should('be.visible');
      }
    });
  });

  it('Hiển thị sao đánh giá đúng', () => {
    cy.wait('@getAllReviews').then((interception) => {
      const reviews = interception.response.body.reviews;
      if (reviews && reviews.length > 0) {
        const review = reviews[0];
        
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(4).find('span').should('exist');
        });
      }
    });
  });

  it('Xóa đánh giá thành công', () => {
    cy.intercept('DELETE', '**/review/*').as('deleteReview');
    
    cy.wait('@getAllReviews').then((interception) => {
      const reviews = interception.response.body.reviews;
      if (reviews && reviews.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.contains('button', 'Xóa').click();
        });
        
        cy.get('.modal').should('be.visible');
        cy.contains('Xác nhận xóa').should('be.visible');
        cy.contains('button', 'Xóa').click();
        
        cy.wait('@deleteReview').then((deleteInterception) => {
          expect(deleteInterception.request.body).to.have.property('userRole', 'admin');
        });
      }
    });
  });

  it('Hủy xóa đánh giá', () => {
    cy.wait('@getAllReviews').then((interception) => {
      const reviews = interception.response.body.reviews;
      if (reviews && reviews.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.contains('button', 'Xóa').click();
        });
        
        cy.get('.modal').should('be.visible');
        cy.contains('button', 'Hủy').click();
        cy.get('.modal').should('not.exist');
      }
    });
  });

  it('Hiển thị khi không có đánh giá', () => {
    cy.intercept('GET', '**/review/all', { reviews: [] }).as('getEmptyReviews');
    cy.reload();
    cy.wait('@getEmptyReviews');
    
    cy.contains('Chưa có đánh giá nào').should('be.visible');
  });

  it('Hiển thị khi không có đánh giá cho phòng được chọn', () => {
    cy.wait('@getRooms').then((interception) => {
      const rooms = interception.response.body.rooms;
      if (rooms && rooms.length > 0) {
        cy.intercept('GET', '**/review/all', { reviews: [] }).as('getNoReviews');
        cy.get('select').select(rooms[0].roomId);
        
        cy.contains('Chưa có đánh giá nào cho phòng này').should('be.visible');
      }
    });
  });

  it('Hiển thị loading khi tải dữ liệu', () => {
    cy.intercept('GET', '**/review/all', { delay: 1000, body: { reviews: [] } }).as('getDelayedReviews');
    cy.reload();
    
    cy.get('.spinner-border').should('be.visible');
    cy.wait('@getDelayedReviews');
    cy.get('.spinner-border').should('not.exist');
  });

  it('Xử lý lỗi khi tải đánh giá thất bại', () => {
    cy.intercept('GET', '**/review/all', { statusCode: 500 }).as('getReviewsError');
    cy.reload();
    
    cy.wait('@getReviewsError');
    cy.get('.alert-danger').should('be.visible');
  });

  it('Định dạng ngày tháng đúng', () => {
    cy.wait('@getAllReviews').then((interception) => {
      const reviews = interception.response.body.reviews;
      if (reviews && reviews.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(6).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
        });
      }
    });
  });

  it('Hiển thị thông tin người đánh giá đúng', () => {
    cy.wait('@getAllReviews').then((interception) => {
      const reviews = interception.response.body.reviews;
      if (reviews && reviews.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(3).invoke('text').should('not.be.empty');
        });
      }
    });
  });
});