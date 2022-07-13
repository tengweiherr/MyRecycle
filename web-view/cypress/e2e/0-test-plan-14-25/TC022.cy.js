
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
            cy.get('input[name="email"]').type('head@head.com')
            cy.get('input[name="password"]').type('password')
            //click login
            cy.get('button').click()
          })
})

describe('Head of JPSPN officer approves collector', () => {
  it('passes', () => {
    cy.get('h1', { timeout: 6000 }).should('contain.text','Head of JPSPN Officer Dashboard');

    cy.visit('http://localhost:8081/collectors');

    cy.wait(3000)

    cy.get('button').contains('Verified').click();
    cy.get('input[type="checkbox"]').first().check();
    // cy.get('button').contains('Verify').click();

  })
})