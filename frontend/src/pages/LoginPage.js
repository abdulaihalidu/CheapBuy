import React, { useState, useEffect } from 'react';
import { Link,  useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/UserActions';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const location = useLocation();
  
    const navigate = useNavigate();
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, userInfo, error } = userLogin;

    useEffect(() => {
      if (userInfo) {
          navigate(redirect)
        }
            
    }, [navigate, userInfo, redirect])  
  

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password));
    }
  return (
    <FormContainer>
          <h1>Log In</h1>
          {error && <Message variant='danger'>{error}</Message>}
          {loading && <Loader />}
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                      type='email'
                      placeholder='Enter email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    >

                  </Form.Control>
              </Form.Group>
              
              <Form.Group controlId='password'>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                      type='password'
                      placeholder='Enter password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    >
                  </Form.Control>
              </Form.Group>
              <Button className='my-3' type='submit'variant='success'>Sign In</Button>
          </Form>
          <Row className='py-3'>
              <Col>
                  New to CheapBuy? <Link
                      style={{ textDecoration: 'none' }}
                      to={redirect ? `/register?redirect=${redirect}`
                                   :'/register'}
                    >
                      Register here</Link>
              </Col>
          </Row>
    </FormContainer>
  )
}

export default LoginPage