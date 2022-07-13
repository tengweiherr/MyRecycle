
before(() => {

  // root-level hook
  // runs once before all tests

  //laptop view
  cy.viewport(1920,1080)

  //visit myrecycle webapp
  cy.visit('http://localhost:8081');

  //login as admin
  cy.get('.form-group')
          .within(() => {
            //fill in email password
            cy.get('input[name="email"]').type('officer@officer.com')
            cy.get('input[name="password"]').type('password')
            //click login
            cy.get('button').click()
          })
})

describe('JPSPN officer verifies product', () => {
  it('passes', () => {
    cy.get('h1', { timeout: 6000 }).should('contain.text','JPSPN Officer Dashboard');

    cy.visit('http://localhost:8081/products');

    cy.wait(3000)

    cy.get('button').contains('Pending').click();
    cy.get('input[type="checkbox"]').first().check();
    cy.get('button').contains('Verify').click();

  })
})