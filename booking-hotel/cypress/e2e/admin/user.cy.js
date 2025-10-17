describe('Quản lý Người dùng - E2E Test', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('http://localhost:3000/users');
    cy.intercept('GET', '**/user/all-user').as('getAllUsers');
  });

  it('Hiển thị trang quản lý người dùng thành công', () => {
    cy.wait('@getAllUsers');

    cy.contains('h2', 'Quản lý người dùng').should('be.visible');
    cy.get('input[placeholder*="Tìm kiếm"]').should('be.visible');
    cy.get('table').should('be.visible');
    cy.get('thead').contains('User ID').should('be.visible');
    cy.get('thead').contains('Họ và tên').should('be.visible');
    cy.get('thead').contains('Email').should('be.visible');
    cy.get('thead').contains('Điện thoại').should('be.visible');
    cy.get('thead').contains('Địa chỉ').should('be.visible');
    cy.get('thead').contains('Vai trò').should('be.visible');
  });

  it('Tìm kiếm người dùng theo tên hoặc email', () => {
    cy.wait('@getAllUsers').then((interception) => {
      const users = interception.response.body.users;
      if (users && users.length > 0) {
        const firstUser = users[0];
        
        cy.get('input[placeholder*="Tìm kiếm"]').type(firstUser.fullname);
        cy.get('input[placeholder*="Tìm kiếm"]').should('have.value', firstUser.fullname);
        
        cy.get('table tbody tr').should('have.length.at.least', 1);
        cy.contains(firstUser.fullname).should('be.visible');
        
        cy.get('input[placeholder*="Tìm kiếm"]').clear().type(firstUser.email);
        cy.contains(firstUser.email).should('be.visible');
      }
    });
  });

  it('Hiển thị danh sách người dùng với thông tin đầy đủ', () => {
    cy.wait('@getAllUsers').then((interception) => {
      const users = interception.response.body.users;
      if (users && users.length > 0) {
        const user = users[0];
        
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(0).should('contain', '***');
          cy.get('td').eq(1).should('contain', user.fullname);
          cy.get('td').eq(2).should('contain', user.email);
          cy.get('td').eq(3).should('contain', user.phone);
          cy.get('td').eq(4).should('contain', user.address);
          cy.get('td').eq(5).should('contain', user.role);
        });
      }
    });
  });

  it('Sửa thông tin người dùng thành công', () => {
    cy.intercept('PUT', '**/user/update-user/*').as('updateUser');
    
    cy.wait('@getAllUsers').then((interception) => {
      const users = interception.response.body.users;
      if (users && users.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.contains('button', 'Sửa').click();
        });
        
        cy.get('.modal').should('be.visible');
        cy.contains('Sửa thông tin người dùng').should('be.visible');
        
        cy.get('input[type="text"]').first().clear().type('Tên Đã Sửa');
        cy.get('input[type="email"]').clear().type('updated@example.com');
        
        cy.contains('button', 'Lưu').click();
        
        cy.wait('@updateUser').then((updateInterception) => {
          expect(updateInterception.request.body).to.have.property('fullname', 'Tên Đã Sửa');
          expect(updateInterception.request.body).to.have.property('email', 'updated@example.com');
        });
      }
    });
  });

  it('Xóa người dùng thành công', () => {
    cy.intercept('DELETE', '**/user/*').as('deleteUser');
    
    cy.wait('@getAllUsers').then((interception) => {
      const users = interception.response.body.users;
      if (users && users.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.contains('button', 'Xóa').click();
        });
        
        cy.on('window:confirm', () => true);
        
        cy.wait('@deleteUser').then((deleteInterception) => {
          expect(deleteInterception.response.statusCode).to.equal(200);
        });
      }
    });
  });

  it('Hủy thao tác tạo người dùng', () => {
    cy.contains('button', 'Tạo người dùng').click();
    cy.get('.modal').should('be.visible');
    cy.contains('button', 'Hủy').click();
    cy.get('.modal').should('not.exist');
  });

  it('Hiển thị khi không có người dùng nào', () => {
    cy.intercept('GET', '**/user/all-user', { users: [] }).as('getEmptyUsers');
    cy.reload();
    cy.wait('@getEmptyUsers');
    
    cy.contains('Không tìm thấy người dùng').should('be.visible');
  });

  it('Hiển thị khi tìm kiếm không có kết quả', () => {
    cy.get('input[placeholder*="Tìm kiếm"]').type('keywordkhongtonto');
    cy.contains('Không tìm thấy người dùng').should('be.visible');
  });

  it('Định dạng User ID đúng cách', () => {
    cy.wait('@getAllUsers').then((interception) => {
      const users = interception.response.body.users;
      if (users && users.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(0).invoke('text').should('match', /^.{2}\*\*\*.{3}$/);
        });
      }
    });
  });

  it('Hiển thị ngày tạo đúng định dạng', () => {
    cy.wait('@getAllUsers').then((interception) => {
      const users = interception.response.body.users;
      if (users && users.length > 0) {
        cy.get('tbody tr').first().within(() => {
          cy.get('td').eq(6).invoke('text').should('match', /\d{1,2}\/\d{1,2}\/\d{4}/);
        });
      }
    });
  });

  it('Hiển thị loading khi tải dữ liệu', () => {
    cy.intercept('GET', '**/user/all-user', { delay: 1000, body: { users: [] } }).as('getDelayedUsers');
    cy.reload();
    
    cy.get('.spinner-border').should('be.visible');
    cy.wait('@getDelayedUsers');
    cy.get('.spinner-border').should('not.exist');
  });

  it('Xử lý lỗi khi tải người dùng thất bại', () => {
    cy.intercept('GET', '**/user/all-user', { statusCode: 500 }).as('getUsersError');
    cy.reload();
    
    cy.wait('@getUsersError');
    // Ứng dụng không crash, table vẫn hiển thị
    cy.get('table').should('be.visible');
  });
});