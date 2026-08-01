describe('Anonymous Q&A', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('arun.gurung@student.edu')
    cy.get('input[name="password"]').type('password')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })

  it('shows the Q&A feed with the ask button', () => {
    cy.visit('/questions')
    cy.contains('Anonymous Q&A')
    cy.contains('Ask a Question')
  })

  it('posts a new question via the modal', () => {
    cy.visit('/questions')
    cy.contains('Ask a Question').click()

    cy.get('#q-subject').select(1)
    cy.get('#q-category').select('conceptual')
    cy.get('#q-title').type('How do I pass props between React components?')
    cy.get('#q-body').type('I keep hitting an error when trying to pass a state value as a prop to a child component in my Inertia + React setup.')

    cy.contains('Post Question').click()

    cy.contains('How do I pass props between React components?')
  })
})
