describe('System admin views the analytic dashboard ', () => {
  it('passes', () => {
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
})