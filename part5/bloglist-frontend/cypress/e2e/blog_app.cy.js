describe('Blog app', () => {
  beforeEach(function() {
    cy.reset_db()
    const user = {
      username: 'Kiko',
      name: 'Lee ???',
      password: 'cute'
    }

    cy.createUser(user)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#login-button')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#Username-input').type('Kiko')
      cy.get('#Password-input').type('cute')
      cy.get('#login-button').click()

      cy.get('.notification').contains('logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#Username-input').type('Kiko')
      cy.get('#Password-input').type('rude')
      cy.get('#login-button').click()

      cy.get('.notification').contains('Wrong credentials')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      const validUser = {
        username: 'Kiko',
        password: 'cute'
      }

      cy.login(validUser)
    })

    it('A blog can be created', function() {
      cy.get('#button-show').contains('New blog').click()
      cy.get('#Author-input').type('A author')
      cy.get('#Title-input').type('A title')
      cy.get('#URL-input').type('A URL')
      cy.get('#create-blog-button').click()

      cy.get('.notification').contains('added successfully')
    })
  })

  describe('When there is an existing blog', function() {
      beforeEach(function() {
        cy.login({
          username: 'Kiko',
          password: 'cute'
        })
        cy.createBlog({
          author: 'An author',
          title: 'A title',
          url: 'An URL'
        })

      })

      it('it can be liked', function() {
        cy.contains('view').click()
        cy.contains('Likes: 0')
        cy.get('.like-button').click()
        cy.contains('Likes: 1')
      })

      it('it can be deleted by the owner', function() {
        cy.contains('view').click()
        cy.get('.remove-button').click()

        cy.contains('An author').should('not.exist')
      })

      it('it cannot be deleted by the other users', function() {
        const newUser = {
          username: 'Cuong',
          password: 'handsome'
        }

        cy.createUser(newUser)

        cy.contains('logout').click()

        cy.login(newUser)

        cy.contains('view').click()
        cy.get('.remove-button').should('not.exist')
      })
  })

  describe('Blogs are ordered by their number of likes', function() {
      it('Listed by the order', function() {
        cy.login({
          username: 'Kiko',
          password: 'cute'
        })

        cy.createBlog({
          author: 'A author',
          title: 'title 1',
          url: 'foo.bar.1'
        })

        cy.createBlog({
          author: 'B author',
          title: 'title 2',
          url: 'foo.bar.2'
        })

        cy.createBlog({
          author: 'C author',
          title: 'title 3',
          url: 'foo.bar.3'
        })

        cy.contains('title 1').contains('view').click()
        cy.contains('title 1').contains('like').as('like_1')

        cy.contains('title 2').contains('view').click()
        cy.contains('title 2').contains('like').as('like_2')

        cy.contains('title 3').contains('view').click()
        cy.contains('title 3').contains('like').as('like_3')

        cy.get('@like_1').click()

        cy.get('@like_2').click()
        cy.get('@like_2').click()
        cy.get('@like_2').click()

        cy.get('@like_3').click()
        cy.get('@like_3').click()

        cy.get('.blog').then((blogs) => {
          expect(blogs.eq(0)).to.contain('title 2')
          expect(blogs.eq(1)).to.contain('title 3')
          expect(blogs.eq(2)).to.contain('title 1')
        })
      })
  })

})