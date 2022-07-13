
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

describe('System admin adds new product with scrapping Excel file', () => {
  it('passes', () => {
    cy.get('h1', { timeout: 6000 }).should('contain.text','Admin Dashboard');
    // cy.get('.sidebar', { timeout: 10000 }).within(()=>{
    //   cy.get('.sidebar__menu__item').contains('Collectors')
    //     .click();
    // })

    cy.visit('http://localhost:8081/products');

    cy.get('button').contains('Load From Excel File').click();
    // cy.get('.modal-content').within(()=>{
      cy.get('input[type=file]').selectFile('./cypress/test-files/test.xlsx',{force:true})
      // cy.get('button').contains('Submit').click()
    })
  
})