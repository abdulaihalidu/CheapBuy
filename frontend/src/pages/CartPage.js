import React, { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button, Card, Image, Form, ListGroup } from 'react-bootstrap';

import  Message  from '../components/Message';
import { addToCart, removeFromCart } from '../actions/CartActions';

function CartPage() {
    
    const { id } = useParams();
    //let { search } = useLocation();
    const [searchParams] = useSearchParams();
    //const qty = search ? Number(search.split('=')[1]) : 1
    const qty = Number(searchParams.get("quantity"))
        
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    
    useEffect(() => {
        if (id) {
            dispatch(addToCart(id, qty))
        }
    }, [dispatch, id, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping')
    }


  return (
      <Row>
          <Col md={8}>
              <h1>Shopping Cart</h1>
              {cartItems.length === 0 ? (
                  <Message variant='info'>
                      Cart is Empty
                      <Link to='/' style={{ textDecoration: 'none' }} >
                           <div>View Items</div>
                      </Link>
                  </Message>
              ) : (
                    <ListGroup variant='flush'>
                          {cartItems.map((item) => (
                              <ListGroup.Item key={item.product}>
                                  <Row>
                                      <Col md={2}>
                                          <Image src={item.image} alt={item.name} fluid rounded/>
                                      </Col>
                                      <Col md={3}>
                                          <Link to={`/product/${item.product}`}
                                            style={{ textDecoration: 'none' }}
                                          >
                                              {item.name}
                                          </Link>
                                      </Col>
                                      <Col md={2}>${item.price}</Col>
                                      <Col md={3}>
                                          <Form.Control
                                                as="select"
                                                    value={item.qty}
                                                        onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}
                                                      >
                                                    {
                                                        [...Array(item.countInStock).keys()].map((num) => (
                                                            <option key={num+1} value={num+1}>
                                                                {num + 1}
                                                            </option>
                                                            ))
                                                    }  
                                            </Form.Control>
                                      </Col>
                                      <Col md={1}>
                                          <Button
                                              className='my-1'
                                              type='button'
                                              variant='danger'
                                              onClick={() => removeFromCartHandler(item.product)}
                                          >
                                              <i className='fas fa-trash'></i>
                                          </Button>
                                      </Col>
                                  </Row> 
                            </ListGroup.Item>
                        ))}  
                    </ListGroup>    
              )
                  
            }
          </Col>
          <Col md={4}>
              <Card>
                  <ListGroup variant='flush'>
                      <ListGroup.Item>
                          <h2>TOTAL ITEMS: {cartItems.reduce((acc, item) => acc + item.qty, 0)}</h2>
                          ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                      </ListGroup.Item>
                      <ListGroup.Item>
                          <Button
                              type='button'
                              className='btn-block w-100'
                              variant='success'
                              disabled={cartItems.length === 0}
                              onClick={checkoutHandler}
                          >
                            Proceed To Checkout
                          </Button>
                      </ListGroup.Item>
                  </ListGroup> 
            </Card>
          </Col>
      </Row>
  )
}

export default CartPage