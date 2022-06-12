import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';

import { createOrder } from '../actions/OrderActions';
import { ORDER_CREATE_RESET } from '../constants/OrderConstants';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';


function PlaceOrderPage() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const orderCreate = useSelector((state) => state.orderCreate)
    const {error, order, success} = orderCreate;

    const cart = useSelector((state) => state.cart);
    const {cartItems, shippingAddress, paymentMethod } = cart
    
    cart.itemsPrice = cartItems.reduce((acc, item) => acc + (item.price*item.qty), 0).toFixed(2)
    cart.shippingFee = (cart.itemsPrice > 250 ? 0 : 25).toFixed(2)
    cart.taxPrice = Number(0.015 * cart.itemsPrice).toFixed(2)
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingFee) + Number(cart.taxPrice)).toFixed(2)

    useEffect(() => {
        if (success) {
            navigate(`/order/${order._id}`)
            dispatch({ type: ORDER_CREATE_RESET })
            
        }
    }, [success, navigate, dispatch])

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cartItems,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingFee: cart.shippingFee,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,

        }))
    }

    return (
      
      <div>
          <CheckoutSteps step1 step2 step3 step4 />
          <Row>
              <Col md={8}>
                  <ListGroup variant='flush'>
                      <ListGroup.Item>
                          <h2>Shipping</h2>
                          <p>
                              <strong>Shipping: </strong>{shippingAddress.address},
                              {' '}{shippingAddress.postalCode},
                              {' '}{shippingAddress.city},
                              {' '}{shippingAddress.country}
                          </p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <h2>Payment Method</h2>
                          <p>
                              <strong>Method: </strong>
                                {paymentMethod}
                          </p>
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <h2>Order Items</h2>
                          {cartItems.length === 0 ? 
                              <Message variant='info'>Your cart is empty! {' '}
                                  <Link style={{textDecoration: 'none'}}
                                      to='/'>Click here to add items
                                  </Link>
                              </Message>
                              :
                              (
                                <ListGroup variant='flush'>
                                      {cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                  <Col md={1}>
                                                      <Image src={item.image} alt={item.name} fluid rounded/>
                                                  </Col>
                                                  <Col>
                                                      <Link
                                                          style={{textDecoration: 'none'}}
                                                          to={`/product/${item.product}`}
                                                      >
                                                          {item.name}
                                                      </Link>
                                                  </Col>
                                                  <Col md={4}>
                                                      {item.qty} X ${item.price} = ${(item.qty*item.price).toFixed(2)}
                                                  </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}  
                                </ListGroup>
                              )
                              
                          }
                      </ListGroup.Item>
                  </ListGroup>  
              </Col>
              <Col md={4}>
                <Card>
                      <ListGroup variant='flush'>
                          <ListGroup.Item>
                              <h2>Order Summary</h2>
                          </ListGroup.Item>
                          <ListGroup.Item>
                              <Row>
                                  <Col>Total Items Price:</Col>
                                  <Col>${cart.itemsPrice}</Col>
                              </Row>
                              <Row>
                                  <Col>Shipping Fee:</Col>
                                    <Col>${cart.shippingFee}</Col>
                              </Row>
                              <Row>
                                  <Col>Tax Price:</Col>
                                  <Col>${cart.taxPrice}</Col>
                              </Row>
                              <Row>
                                  <Col>Total:</Col>
                                  <Col>${cart.totalPrice}</Col>
                              </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                {error && <Message variant='danger'>{error}</Message>} 
                            </ListGroup.Item>
                          <ListGroup.Item>
                              <Button
                                    type='button'
                                    variant='success'
                                    className='btn-block w-100'
                                    disabled={cartItems.length === 0}
                                    onClick={placeOrderHandler}
                              >
                                  Place Order
                              </Button>
                          </ListGroup.Item>
                      </ListGroup>   
                </Card>
              </Col>
          </Row>
    </div>
  )
}

export default PlaceOrderPage