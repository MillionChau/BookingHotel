describe("Hotel Management E2E", () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/hotelmanagement');
  });

  it("Load danh sách khách sạn", () => {
    cy.get("table tbody tr").should("exist");
  });

  it("Thêm khách sạn mới", () => {
    cy.contains("Thêm khách sạn").click();

    cy.get("input[placeholder='hotelName']").type("KS Cypress Test");
    cy.get("input[placeholder='hotelAddress']").type("123 - Đường Test");
    cy.get("textarea[placeholder='hotelDesc']").type("Khách sạn test cho Cypress");
    cy.get("input[placeholder='hotelManager']").type("Nguyễn Văn A");
    cy.get("input[placeholder='hotelReview']").clear().type("4");
    cy.get("input[placeholder='imageUrl']").type("https://via.placeholder.com/80");

    cy.get(".modal-dialog").within(() => {
      cy.contains("button", "Lưu").click({ force: true });
    });

    cy.contains("td", "KS Cypress Test").should("exist");
  });

  it("Sửa khách sạn vừa thêm", () => {
    cy.contains("td", "KS Cypress Test")
      .parent("tr")
      .within(() => {
        cy.get("button.btn-warning").click({ force: true });
      });

    cy.get("input[placeholder='hotelName']").clear().type("KS Cypress Edited");

    cy.get(".modal-dialog").within(() => {
      cy.contains("button", "Lưu").click({ force: true });
    });

    cy.contains("td", "KS Cypress Edited").should("exist");
  });

  it("Xóa khách sạn vừa sửa", () => {
    cy.contains("td", "KS Cypress Edited")
      .parent("tr")
      .within(() => {
        cy.get("button.btn-danger").click({ force: true });
      });

    cy.get("table tbody").should("not.contain", "KS Cypress Edited");
  });
});
