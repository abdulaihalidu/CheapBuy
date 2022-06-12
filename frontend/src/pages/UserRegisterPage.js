import React, { useState, useEffect } from 'react';
import { Link,  useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/UserActions';

function UserRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const location = useLocation();
  
  const navigate = useNavigate();
  const redirect = location.search ? location.search.split('=')[1] : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;

  useEffect(() => {
    if (userInfo) {
        navigate(redirect)
      }
            
  }, [navigate, userInfo, redirect])  
  

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Password mismatch!')
    }
    else {
      dispatch(register(name, email, password));
    }
  }
  return (
    <FormContainer>
      <h1>Sign up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            >

          </Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
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
            required
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            >
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='passwordConfirm'>
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            required
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            >
          </Form.Control>
        </Form.Group>
        <Button className='my-3' type='submit'variant='primary'>Sign up</Button>
      </Form>
      <Row className='py-3'>
              <Col>
                  Already have an account? <Link
                      style={{ textDecoration: 'none' }}
                      to={redirect ? `/login?redirect=${redirect}`
                                   :'/login'}
                    >
                      Login here</Link>
              </Col>
      </Row>
    </FormContainer>
  )
}

export default UserRegisterPage