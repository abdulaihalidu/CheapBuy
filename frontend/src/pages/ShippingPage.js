import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../actions/CartActions';
import  CheckoutSteps  from '../components/CheckoutSteps';


function ShippingPage() {
    const cart = useSelector((state) => state.cart)
    const { shippingAddress } = cart
    
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            saveShippingAddress({ country, city, address, postalCode })
        )
        navigate('/payment')
    }
  return (
      <FormContainer>
          <CheckoutSteps step1 step2 />
          <h2>Shipping</h2>
          <Form
              onSubmit={submitHandler}
          >
            <Form.Group controlId='country'>
                <Form.Label>Country</Form.Label>
                <Form.Control
                    required
                    type='text'
                    placeholder='Enter country'
                    value={country ? country : ''}
                    onChange={(e) => setCountry(e.target.value)}
                    >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='city'>
                <Form.Label>City</Form.Label>
                <Form.Control
                    required
                    type='text'
                    placeholder='Enter city'
                    value={city ? city : ''}
                    onChange={(e) => setCity(e.target.value)}
                    >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='address'>
                <Form.Label>Address</Form.Label>
                <Form.Control
                    required
                    type='text'
                    placeholder='Enter address'
                    value={address ? address : ''}
                    onChange={(e) => setAddress(e.target.value)}
                    >
                </Form.Control>
            </Form.Group>
            
            <Form.Group controlId='postalCode'>
                <Form.Label>Postal Code</Form.Label>
                <Form.Control
                    required
                    type='text'
                    placeholder='Enter postal code'
                    value={postalCode ? postalCode : ''}
                    onChange={(e) => setPostalCode(e.target.value)}
                    >
                </Form.Control>
            </Form.Group>
            <Button
                type='submit'
                variant='success'
                className='my-2'  
            >
                  Continue
            </Button>
          </Form> 
    </FormContainer>
  )
}

export default ShippingPage