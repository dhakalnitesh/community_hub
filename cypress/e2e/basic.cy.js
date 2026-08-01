describe('EduVoice System Tests', () => {
  it('loads the homepage successfully', () => {
    cy.visit('/')
    cy.contains('Backbenchers')
    cy.contains('Where Backbenchers Turn Ideas Into Breakthroughs')
  })

  it('can navigate to login', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').should('exist')
    cy.get('input[name="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })
})
