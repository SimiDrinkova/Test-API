

describe('api testing', ()=>{
  beforeEach(()=>{
    cy.visit('https://reqres.in/')
  })
})

it('GET call', ()=>{
  cy.request('GET','https://reqres.in/api/users?page=2').as('Users')
  cy.get('@Users').then((response)=>{
    expect(response.status).to.eq(200)
    expect(response.body.page).to.eq(2)
    expect(response.body.data).has.length(6)
    expect(response.body.data[0]).have.property('id', 7)
    expect(response.body.data[0]).has.property('first_name', 'Michael')
  })
})

it('POST call', ()=>{
  cy.request({
    method: 'POST',
    url: 'https://reqres.in/api/users/2',
    body: {
      "name": "morpheus",
      "job": "zion resident"
    }
  }).as('CreateUsers')
  cy.get('@CreateUsers').then((response) =>{
    expect(response.status).to.eq(201)
    expect(response.body).to.have.property('name', 'morpheus')
    expect(response.body).to.have.property('job', 'zion resident')
  })
})

it('PUT call', ()=>{
  cy.request({
    method:'PUT',
    url: 'https://reqres.in/api/users/2',
    body: {
      "name": "morpheus",
      "job": "zion resident"
    }
  }).as('UpdateUsers')
  cy.get('@UpdateUsers')
    .its('status')
    .should('eq', 200)
})

it('DELETE call', ()=>{
  cy.request('DELETE', 'https://reqres.in/api/users/2').as('DeleteUser')
  cy.get('@DeleteUser').then((response)=>{
    expect(response.status).to.eq(204),
    expect(response.body).to.be.empty;
  })
})

let tokenAuth = null

it('Login', ()=>{
  cy.request({
    method: 'POST',
    url: 'https://simple-books-api.glitch.me/api-clients/',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      'clientName': "Sivir",
      "clientEmail": "Sivir@Sivir22s22.com"
    }
  }).as('Login')
  cy.get('@Login').then((response)=>{
    console.log(response.body); // Add this line to check the structure of the response
    tokenAuth = response.body.accessToken;
    console.log(tokenAuth); // Add this line to check the value of tokenAuth
  })
})

it('Post from login and create order', ()=>{
  console.log(tokenAuth)
  cy.request({
    method: 'POST',
    url: 'https://simple-books-api.glitch.me/orders',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenAuth}`
    },
    body: {
      "bookId": 1,
      "customerName": "Milan"
    }
  }).as('NewBook')
  cy.get('@NewBook').then((response)=>{
    expect(response.status).to.eq(201)
    expect(response.body.created).to.eq(true)
  })
})

it('Update order', ()=>{
  console.log(tokenAuth)
  cy.request({
    method: 'POST',
    url: 'https://simple-books-api.glitch.me/orders',
    headers: {
      "Content-type": "application/json",
      "Authorization": `Bearer ${tokenAuth}`
    },
    body: {
      "bookId": 1,
      "customerName": "JedenTypek"
    }
  }).as('UpdateOrder')
  cy.get('@UpdateOrder').then((response)=>{
    console.log(response.body)
    expect(response.status).to.eq(201)
    expect(response.body.created).to.eq(true)
  })
})
