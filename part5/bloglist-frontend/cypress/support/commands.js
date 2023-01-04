// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', ({username, password}) => { 
    // login with post request instead of typing a valid credential
    cy.request('POST', 'http://localhost:3003/api/login', {
        username, password
    })
    .then(response => {
      localStorage.setItem('loggedInUser', JSON.stringify(response.body))
      cy.visit('http://localhost:3000')
    })
 })

Cypress.Commands.add('reset_db', () => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
})

Cypress.Commands.add('createUser', (user) => {
    cy.request('POST', 'http://localhost:3003/api/users', user)
})

Cypress.Commands.add('createBlog', ({author, title, url}) => {
    cy.get('#button-show').contains('New blog').click()
    cy.get('#Author-input').type(author)
    cy.get('#Title-input').type(title)
    cy.get('#URL-input').type(url)
    cy.get('#create-blog-button').click()
})