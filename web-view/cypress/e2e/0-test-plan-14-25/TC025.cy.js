
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

describe('System admin adds new recycling guide with valid data', () => {
  it('passes', () => {
    cy.get('h1', { timeout: 6000 }).should('contain.text','Admin Dashboard');
    // cy.get('.sidebar', { timeout: 10000 }).within(()=>{
    //   cy.get('.sidebar__menu__item').contains('Collectors')
    //     .click();
    // })

    cy.visit('http://localhost:8081/guides');

    cy.get('button').contains('Add New').click();
    // cy.get('.modal-content').within(()=>{
    //     cy.get('input[name="name"]').type('Tzu Chi')
    //     cy.get('input[name="daerah"]').type('Johor')
    //     cy.get('input[name="alamat"]').type('12, Jalan Durian, Taman Banana, 84000 Muar')
    //     cy.get('input[name="telefon"]').type('0177124432')
    //     cy.get('input[name="faks"]').type('0177124432')
    //     cy.get('input[name="pic"]').type('John Doe')
    //     cy.get('input[name="type"]').type('Cypress Testing')
    //     cy.get('select[name="category"]').select('General Waste')
    //     cy.get('input[name="lat"]').type('5.33234')
    //     cy.get('input[name="long"]').type('100.244342')

    //     cy.get('button').contains('Save Changes').click()
    // })

  })
})