import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Form, Button } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../actions/CartActions';
import  CheckoutSteps  from '../components/CheckoutSteps';



function PaymentPage() {
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [paymentMethod, setPaymentMethod] = useState('PayPal');
    const dispatch = useDispatch();

    if (!shippingAddress.address) {
        navigate('/shipping');
    }
    
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

  return (
      <FormContainer>
          <CheckoutSteps step1 step2 step3 /> 
          <Form
           onSubmit={submitHandler}
          >
              <Form.Group>
                  <Form.Label as='legend'>Select Method</Form.Label>
                  <Col>
                      <Form.Check
                          type='radio'
                          label='Credit Card or PayPal?'
                          id='paypal'
                          name='paymentMethod'
                          checked
                          onChange={(e) => setPaymentMethod(e.target.value) }
                      >

                      </Form.Check>
                  </Col>
              </Form.Group>
              <Button type='submit' variant='success'>
                  Proceed
              </Button>
          </Form>
      </FormContainer>
  )
}

export default PaymentPage