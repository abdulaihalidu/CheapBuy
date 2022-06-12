import React from 'react'
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function CheckoutSteps({step1, step2, step3, step4}) {
  return (
    <Nav className='justify-content-center mb-4'>
          <Nav.Item>
              {step1 ? (
                  <LinkContainer
                  to='/login'
              >
                  <Nav.Link style={{ textDecoration: 'none' }}>Login</Nav.Link>
              </LinkContainer>
              ) :
                  (
                      <Nav.Link
                          style={{ textDecoration: 'none' }}
                          disabled
                      >
                          Login
                      </Nav.Link>
                  )}
            </Nav.Item>
            <Nav.Item>  
              {step2 ? (
                  <LinkContainer
                      to='/shipping'
              >
                  <Nav.Link style={{ textDecoration: 'none'}}>Shipping</Nav.Link>
              </LinkContainer>
              ) :
                  (
                      <Nav.Link
                          style={{ textDecoration: 'none' }}
                          disabled
                      >
                          Shipping
                      </Nav.Link>
                  )}
            </Nav.Item> 
            <Nav.Item>
              {step3 ? (
                  <LinkContainer
                  to='/payment'
              >
                  <Nav.Link style={{ textDecoration: 'none' }}>Payment</Nav.Link>
              </LinkContainer>
              ) :
                  (
                      <Nav.Link
                          style={{ textDecoration: 'none' }}
                          disabled
                      >
                          Payment
                      </Nav.Link>
                  )}
            </Nav.Item>
            <Nav.Item>
              {step4 ? (
                  <LinkContainer
                  to='/placeorder'
              >
                  <Nav.Link style={{ textDecoration: 'none' }}>Place Order</Nav.Link>
              </LinkContainer>
              ) :
                  (
                      <Nav.Link
                          style={{ textDecoration: 'none' }}
                          disabled
                      >
                          Place Order
                      </Nav.Link>
              )}
              
          </Nav.Item>

    </Nav>
  )
}

export default CheckoutSteps