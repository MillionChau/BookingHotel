// tests/admin/RoomManager.e2e.test.js
describe('Room Management', () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/rooms');
  });

  it('should load room management with hotel selection', () => {
    cy.contains('Quản lý phòng').should('be.visible');
    cy.get('select').first().should('contain', 'Chọn khách sạn');
  });

  it('should load rooms when hotel is selected', () => {
    // Chọn hotel đầu tiên từ dropdown
    cy.get('select').first().select(1);
    
    // Kiểm tra table rooms được load
    cy.get('table tbody tr').should('have.length.gt', 0);
  });

  it('should add new room to selected hotel', () => {
    cy.get('select').first().select(1);
    cy.contains('Thêm phòng').click();
    
    // Điền thông tin phòng
    cy.get('input[name="name"]').type('Phòng Deluxe E2E');
    cy.get('input[name="type"]').type('Deluxe');
    cy.get('input[name="price"]').type('1500000');
    cy.get('select[name="status"]').select('available');
    cy.get('input[name="imageUrl"]').type('https://example.com/room.jpg');
    
    cy.contains('Lưu').click();
    
    // Kiểm tra phòng mới
    cy.contains('Phòng Deluxe E2E').should('be.visible');
  });
});