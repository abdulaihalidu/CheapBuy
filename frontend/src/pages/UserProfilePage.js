import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { getUserDetails, updateUserProfile } from '../actions/UserActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';
import { myOrderList } from '../actions/OrderActions';

function UserProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
    
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, user, error } = userDetails;
  
  const myorderList = useSelector((state) => state.myOrderList);
  const { loading:loadingOrders, error:errorOrders, orders } = myorderList;

  const userProfileUpdate = useSelector((state) => state.userProfileUpdate);
  const { success } = userProfileUpdate;
    
  useEffect(() => {
    if (!userInfo) {
        navigate('/login')
    }
    else {
        if (!user || !user.name || success || userInfo._id !== user._id) {
            dispatch({
                type: USER_UPDATE_PROFILE_RESET
            })
            dispatch(getUserDetails('profile'))
            dispatch(myOrderList())
        }
        else {
            setName(user.name);
            setEmail(user.email)
        }
      }
            
  }, [dispatch, navigate, userInfo, user, success])  
  

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Password mismatch!')
    }
    else {
        dispatch(updateUserProfile({
            'id': user._id,
            'name': name,
            'email': email,
            'password': password
        }))
        setMessage('')
    }
  }
  return (
      <Row>
          <Col md={3}>
            <h2>{name}</h2>
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
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    >
                </Form.Control>
                </Form.Group>
                <Button className='my-3' type='submit'variant='primary'>Update profile</Button>
            </Form>
          </Col>
          <Col md={9}>
              <h2>Orders</h2>
              {loadingOrders ? (
                  <Loader />
              ) : errorOrders ? (
                      <Message variant='danger'>{errorOrders}</Message>  
                  ) : (
                        <Table striped responsive className='table-sm'>
                              <thead>
                                  <tr>
                                      <th>ID</th>
                                      <th>Date</th>
                                      <th>Total</th>
                                      <th>Paid</th>
                                      <th>Delivered</th>
                                      <th></th>
                                  </tr>
                              </thead>
                              <tbody>
                                  {orders.map(order => (
                                    <tr key={order._id}>
                                          <td>{order._id}</td>
                                          <td>{order.createdAt.substring(0, 10)}</td>
                                          <td>${order.totalPrice}</td>
                                          <td>{order.isPaid ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                              : (<i className='fas fa-times' style={{ color: 'red', }}></i>)}</td>
                                          <td>{order.isDelivered ? (<i className='fas fa-check' style={{ color: 'green' }}></i>)
                                              : (<i className='fas fa-times' style={{ color: 'red' }}></i>)}</td>
                                          <td>
                                              <LinkContainer 
                                                  style={{ texDecoration: 'none' }}
                                                  to={`/order/${order._id}`}
                                              >
                                                  <Button className='btn-sm'>
                                                    Details
                                                  </Button>
                                              </LinkContainer>
                                          </td>
                                    </tr>
                                ))}
                              </tbody>
                       </Table>   
              )
            }
          </Col>
    </Row>
  )
}

export default UserProfilePage