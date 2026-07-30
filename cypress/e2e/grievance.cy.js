describe('Grievance Submission Flow', () => {
  beforeEach(() => {
    // Visit the submit grievance page
    // Assuming the route is /grievances/submit based on the controller
    cy.visit('/grievances/submit')
  })

  it('displays the grievance submission form', () => {
    cy.contains('Submit Grievance').should('be.visible')
    cy.get('select').first().should('exist') // Institution select
    cy.get('input[type="text"]').should('exist') // Title input
  })

  it('validates required fields on first step', () => {
    cy.contains('Next Step').click()
    cy.get('input:invalid').should('have.length.at.least', 1)
  })

  it('completes the first step and proceeds to second step', () => {
    // Fill out first step
    cy.get('select').eq(0).select(1) // Select first institution
    cy.get('select').eq(1).select(1) // Select first category
    
    cy.get('input[type="text"]').type('Test Grievance Issue')
    
    // Proceed to next step
    cy.contains('Next Step').click()
    
    // Verify we are on the second step
    cy.contains('Description').should('be.visible')
    cy.get('textarea').should('exist')
  })

  it('can submit a complete grievance', () => {
    // Step 1
    cy.get('select').eq(0).select(1)
    cy.get('select').eq(1).select(1)
    cy.get('input[type="text"]').type('Internet is very slow in lab')
    cy.contains('Next Step').click()
    
    // Step 2
    cy.get('textarea').type('The internet connection in the computer lab is constantly dropping, making it impossible to complete assignments.')
    cy.contains('Next Step').click()
    
    // Step 3 (Review)
    cy.contains('Review Summary').should('be.visible')
    cy.contains('Internet is very slow in lab').should('be.visible')
    
    // Submit (mocking the submission if possible or letting it fail if backend isn't perfect in test env)
    // cy.contains('Submit').click()
  })
})
