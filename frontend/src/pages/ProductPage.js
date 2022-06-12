import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Button, Card, Form } from 'react-bootstrap';

import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { productDetails, createProductReview } from '../actions/ProductActions';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

function ProductPage() {
    const [quantity, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const dispatch = useDispatch();
    const {id} = useParams();
    const navigate = useNavigate();
    

    const pDetails = useSelector(state => state.productDetails)
    const { loading, product, error } = pDetails
    
    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin;
    
    const productReviewCreate = useSelector(state => state.productReviewCreate)
    const { loading:loadingR, success:successR, error:errorR } = productReviewCreate
    
    
    useEffect(() => {
        if (successR) {
            setRating(0)
            setComment('')

            dispatch({
                type: PRODUCT_REVIEW_CREATE_RESET
            })
        }
        dispatch(productDetails(id))  

    }, [dispatch, id, successR]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}?quantity=${quantity}`);
           
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(createProductReview(
            id,
            {
                rating,
                comment
            }
        ))
    }


  return (
    <div>
          <Link to='/' className='btn btn-danger my-3' style={{ textDecoration: 'none' }}>
              &larr;Back
          </Link>
          {loading ? <Loader />
              : error ? <Message variant='danger'>{error}</Message>
                  : (
                      <div>
                      <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid/>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating value={product.rating}
                                        text={`${product.numReviews} reviews`}
                                        color={'#f8e825'} /> 
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price: ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Product details: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <ListGroup variant='flush'>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Price:</Col>
                                            <Col><strong>${product.price}</strong></Col>
                                        </Row>
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Status:</Col>
                                            <Col>
                                                {product.countInStock > 0? 'In stock': 'Out of stock'}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                      
                                      {product.countInStock > 0 && (
                                          <ListGroup.Item>
                                              <Row>
                                                  <Col>Quantity</Col>
                                                  <Col xs='auto' className='my-1'>
                                                      <Form.Control
                                                          as="select"
                                                          value={quantity}
                                                          onChange={(e) => setQty(e.target.value)}
                                                      >
                                                          {
                                                              [...Array(product.countInStock).keys()].map((num) => (
                                                                  <option key={num+1} value={num+1}>
                                                                      {num + 1}
                                                                  </option>
                                                            ))
                                                        }  
                                                   </Form.Control>
                                                  </Col>
                                              </Row>
                                          </ListGroup.Item>
                                    )}

                                    <ListGroup.Item>
                                          <Button
                                              onClick={addToCartHandler}
                                              className='btn-block w-100'
                                                disabled={product.countInStock === 0}
                                                type='button'
                                          >
                                            Add to Cart
                                        </Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                        </Col>
                        </Row>
                        <Row>
                              <Col md={6}>
                                  <h5>Reviews</h5>
                                  {product.reviews.length === 0 && 
                                      <Message variant='info'>No reviews</Message>}
                                  <ListGroup variant='flush'>
                                      {product.reviews.map((review) => (
                                        <ListGroup.Item key={review._id}>
                                              <strong>{review.name}</strong>
                                              <Rating value={review.rating} color={'#f8e825'} />
                                              <p>{review.createdAt.substring(0, 10)}</p>
                                              <p>{review.comment}</p>
                                        </ListGroup.Item>
                                      ))}
                                      <ListGroup.Item>
                                          <h5>Leave a review</h5>
                                          {loadingR && <Loader />}
                                          {successR && <Message variant='success'>Review successfully submitted</Message>}
                                          {errorR && <Message variant='danger'>{errorR}</Message>}
                                          {userInfo ? (
                                            <Form onSubmit={submitHandler}>
                                                <Form.Group controlId='rating'>
                                                      <Form.Label>Rating</Form.Label>
                                                      <Form.Control
                                                          as='select'
                                                          value={rating}
                                                          onChange={(e) => setRating(e.target.value)}
                                                      >
                                                          <option value=''>SELECT</option>
                                                          <option value='1'>1 - Poor</option>
                                                          <option value='2'>2 - Fair</option>
                                                          <option value='3'>3 - Good</option> 
                                                          <option value='4'>4 - Very Good</option>
                                                          <option value='5'>5 - Excellent</option>
                                                      </Form.Control>
                                                </Form.Group> 
                                                <Form.Group controlId='comment'>
                                                      <Form.Label>Comment</Form.Label>
                                                    <Form.Control
                                                        as='textarea' 
                                                        row='6'  
                                                        value={comment}  
                                                        onChange={(e) => setComment(e.target.value)} 
                                                    >

                                                      </Form.Control>
                                                </Form.Group>
                                                <Button
                                                    className='my-2'  
                                                    disabled={loadingR}  
                                                    type='submit'
                                                    variant='success'
                                                >
                                                  Submit
                                                </Button> 
                                            </Form>
                                          ): (
                                            <Message viariant='info'>
                                                      Plsease
                                                      <Link to='/login' style={{textDecoration: 'none'}}>
                                                          {' '}Login
                                                      </Link> to leave a review       
                                            </Message>  
                                          )}
                                      </ListGroup.Item>
                                  </ListGroup>
                              </Col>
                        </Row>
                    </div>
                    )
          }
          
    </div>
  )
}

export default ProductPage