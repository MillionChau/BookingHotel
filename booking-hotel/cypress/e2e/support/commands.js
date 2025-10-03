// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
// ***********************************************

// -- Clear Authentication Command --
Cypress.Commands.add('clearAuth', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('user');
    win.localStorage.removeItem('token');
  });
});

// -- Login as Admin Command --
Cypress.Commands.add('loginAsAdmin', () => {
  const adminUser = {
    email: 'admin@example.com',
    password: 'admin',
    role: 'Admin'
  };
  
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify(adminUser));
    win.localStorage.setItem('token', 'fake-admin-token');
  });
});

// -- Login as Customer Command --
Cypress.Commands.add('loginAsCustomer', () => {
  const customerUser = {
    userId: 'customer123',
    fullname: 'Customer User', 
    email: 'customer@example.com',
    role: 'Customer'
  };
  
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify(customerUser));
    win.localStorage.setItem('token', 'fake-customer-token');
  });
});