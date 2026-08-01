describe('Authentication', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('redirects guests away from protected pages', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/login')
  })

  it('logs in as a student and lands on the dashboard', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('arun.gurung@student.edu')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/dashboard')
    cy.contains('Welcome back, Arun')
  })

  it('rejects invalid credentials', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('arun.gurung@student.edu')
    cy.get('input[name="password"]').type('wrong-password')
    cy.get('button[type="submit"]').click()

    cy.url().should('include', '/login')
    cy.contains('These credentials do not match our records.')
  })

  it('logs the user out back to the public homepage', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('arun.gurung@student.edu')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')

    cy.contains('button', 'Arun Gurung').click()
    cy.contains('Log out').click()

    cy.url().should('include', '/')
    cy.contains('Backbenchers')
  })
})
