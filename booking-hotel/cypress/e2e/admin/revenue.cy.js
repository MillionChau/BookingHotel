describe('Revenue Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/revenue');
  });

  it('should load revenue dashboard with stats cards', () => {
    cy.contains('Quản lý Doanh thu').should('be.visible');
    
    // Kiểm tra cards thống kê
    cy.contains('Tổng doanh thu').should('be.visible');
    cy.contains('Tổng số booking').should('be.visible');
    cy.contains('Số khách sạn').should('be.visible');
  });

  it('should filter revenue by hotel and date', () => {
    // Chọn hotel
    cy.get('select[name="hotelId"]').select(1);
    
    // Chọn tháng
    cy.get('select[name="month"]').select('1');
    
    // Chọn năm
    cy.get('input[name="year"]').clear().type('2024');
    
    cy.contains('Áp dụng').click();
    
    cy.get('table tbody tr').should('exist');
  });

  it('should display revenue table with pagination', () => {
    cy.contains('Khách sạn').should('be.visible');
    cy.contains('Tháng/Năm').should('be.visible');
    cy.contains('Tổng doanh thu').should('be.visible');
    
    cy.get('.pagination').should('exist');
  });
});