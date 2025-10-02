describe('Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/dashboard');
  });

  it('should load dashboard with all components', () => {
    // Kiểm tra tiêu đề
    cy.contains('Tổng quan').should('be.visible');
    
    // Kiểm tra filter controls
    cy.get('select').should('have.length', 3);
    
    // Kiểm tra cards thống kê
    cy.contains('Doanh thu').should('be.visible');
    cy.contains('Phòng đã đặt').should('be.visible');
    cy.contains('Tỉ lệ lấp đầy').should('be.visible');
    cy.contains('Người dùng').should('be.visible');
  });

  it('should filter data when changing hotel selection', () => {
    cy.get('select').first().select(1);
    cy.contains('Doanh thu theo tháng').should('be.visible');
    
    // Kiểm tra biểu đồ được render
    cy.get('.recharts-line').should('exist');
  });

  it('should update revenue card when changing month', () => {
    const currentMonth = new Date().getMonth() + 1;
    cy.get('select').eq(2).select('1');
    
    // Kiểm tra doanh thu được cập nhật
    cy.contains('Doanh thu (tháng 1)').should('be.visible');
  });
});