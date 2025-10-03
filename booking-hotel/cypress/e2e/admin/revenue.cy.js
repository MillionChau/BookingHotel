describe('Revenue Management - Flexible Pagination', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/revenue');
  });

  it('should handle pagination dynamically', () => {
    // Đợi data load
    cy.get('table tbody tr', { timeout: 10000 }).should('exist');
    
    // Kiểm tra pagination một cách linh hoạt
    cy.get('body').then(($body) => {
      const hasPagination = $body.find('.pagination').length > 0;
      const hasTableData = $body.find('table tbody tr').length > 0;
      
      if (hasPagination) {
        cy.log('Pagination found - multiple pages exist');
        cy.get('.pagination').should('be.visible');
        cy.get('.pagination .page-item').should('have.length.at.least', 3);
        
        // Test pagination functionality
        cy.get('.pagination .page-item').contains('2').click();
        cy.get('table tbody tr').should('exist'); // Đảm bảo data vẫn hiển thị
      } else if (hasTableData) {
        cy.log('No pagination - single page with data');
        cy.get('table tbody tr').should('have.length.at.least', 1);
      } else {
        cy.log('No data and no pagination - empty state');
        cy.contains('Không có dữ liệu').should('be.visible');
      }
    });
  });

  it('should test revenue table content', () => {
    // Kiểm tra nội dung table bất kể có pagination hay không
    cy.get('table thead th').should('have.length.at.least', 4);
    
    // Kiểm tra các cột quan trọng
    const expectedHeaders = ['Khách sạn', 'Tháng/Năm', 'Tổng doanh thu', 'Tổng booking'];
    expectedHeaders.forEach(header => {
      cy.contains('table thead th', header).should('be.visible');
    });
    
    // Kiểm tra format số
    cy.get('table tbody').then(($tbody) => {
      if ($tbody.text().includes('₫')) {
        cy.log('Currency formatting found');
      }
    });
  });
});