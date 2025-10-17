describe('Booking Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/bookings');
  });

  it('should load booking list', () => {
    cy.contains('Quản lý đơn đặt phòng').should('be.visible');
    cy.get('table').should('be.visible');
    cy.contains('Làm mới').should('be.visible');
  });

  it('should display booking status badges correctly', () => {
    cy.intercept('GET', '**/booking').as('getBookings');
    cy.wait('@getBookings');
    
    cy.get('.badge').should('exist');
    cy.get('.badge').then(($badges) => {
      if ($badges.length > 0) {
        expect($badges).to.satisfy(($els) => {
          const classes = $els.map((i, el) => el.className).get();
          return classes.some(cls => 
            cls.includes('bg-') || 
            cls.includes('bg-success') || 
            cls.includes('bg-danger') || 
            cls.includes('bg-primary') || 
            cls.includes('bg-secondary')
          );
        });
      }
    });
  });

  it('should handle different booking statuses', () => {
    cy.intercept('GET', '**/booking').as('getBookings');
    cy.wait('@getBookings');
    
    cy.get('table tbody tr').should('have.length.gt', 0);

    cy.get('table thead th').contains('Mã đơn').should('exist');
    cy.get('table thead th').contains('Trạng thái đơn').should('exist');
    cy.get('table thead th').contains('Trạng thái TT').should('exist');
  });

  it('should refresh booking list', () => {
    cy.intercept('GET', '**/booking').as('refreshBookings');
    
    cy.contains('Làm mới').click();
    cy.wait('@refreshBookings');
    
    cy.get('table tbody tr').should('exist');
  });

  it('should handle empty booking state', () => {
    cy.intercept('GET', '**/booking', {
      statusCode: 200,
      body: {
        bookings: []
      }
    }).as('emptyBookings');
    
    cy.visit('/bookings');
    cy.wait('@emptyBookings');
    
    cy.contains('Không có đơn đặt nào').should('be.visible');
  });
});