
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
            cy.get('input[name="email"]').type('admin@admin.com')
            cy.get('input[name="password"]').type('password')
            //click login
            cy.get('button').click()
          })
})

describe('System admin adds new product with valid data', () => {
  it('passes', () => {
    cy.get('h1', { timeout: 6000 }).should('contain.text','Admin Dashboard');
    // cy.get('.sidebar', { timeout: 10000 }).within(()=>{
    //   cy.get('.sidebar__menu__item').contains('Collectors')
    //     .click();
    // })

    cy.visit('http://localhost:8081/products');

    cy.get('button').contains('Add New').click();
    cy.get('.modal-content').within(()=>{
        cy.get('input[name="gtin"]').type(Math.floor(Math.random() * 1000000000))
        cy.get('input[name="name"]').type('Cypress Testing')
        cy.get('select[name="recyclable"]').select('yes')
        cy.get('select[name="material_id"]').select('8')
        cy.get('button').contains('Save Changes').click()
    })

  })
})