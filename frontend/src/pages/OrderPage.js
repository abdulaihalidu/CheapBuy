import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Image, ListGroup, Row } from 'react-bootstrap';

import {
    getOrderDetails,
    payOrder,
    deliverOrder
} from '../actions/OrderActions';

import Message from '../components/Message';
import Loader from '../components/Loader'
import { PayPalButton } from 'react-paypal-button-v2';

import {
    ORDER_PAY_RESET,
    ORDER_DELIVER_RESET
} from '../constants/OrderConstants';


function OrderPage() {
    const { id } = useParams();

    const [sdkReady, setSdkReady] = useState(false)

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const orderDetails = useSelector((state) => state.orderDetails)
    const { error, loading, order } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay, } = orderPay
    
    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver,  } = orderDeliver

    if (!loading && !error) {
        order.itemsPrice = order.orderItems.reduce((acc, item) => acc + (item.price*item.qty), 0).toFixed(2)
    }

    const addPayPalScript = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript'
        script.src = 'https://www.paypal.com/sdk/js?client-id=AaRsu0-FTFioVyhegrtPGUlJJK8g-iQFeB-sL3CjbsWs17p9hnp9x2Vl0C_imOqBpbIbc55w_ZCyvCxO'
        script.async = true
        script.onload = () => {
            setSdkReady(true);
        }
        document.body.appendChild(script)
    }

    useEffect(() => {
        if (!userInfo) {
            navigate('/login')
        }

        if (!order || successPay || order._id !== Number(id) || successDeliver) {
            dispatch({
                type: ORDER_PAY_RESET
            })
            dispatch({
                type: ORDER_DELIVER_RESET
            })
            
            dispatch(getOrderDetails(id))
        }
        else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            }
            else {
                setSdkReady(true)
            }
        }
        
        
    },[order, id,  dispatch, successPay, successDeliver, navigate, userInfo])

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(id, paymentResult))
    }


    const deliverOrderHandler = () => {
        dispatch(deliverOrder(order))
    }


    return loading ? (
        <Loader/>
    ) : error ? (
            <Message variant='danger'>{error}</Message>
        ) :
            (
      
                <div>
                    <h2>Order: {id}</h2>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant='flush'>
                                <ListGroup.Item>
                                    <h2>Shipping</h2>
                                    <p><strong>Name:</strong> {order.user.name}</p>
                                    <p>
                                        <strong>Email:</strong> <a style={{ textDecoration: 'none' }} href={`mailto:${order.user.email}`}>{order.user.email}</a>
                                    </p>
                                    <p>
                                        <strong>Shipping: </strong>{order.shippingAddress.address},
                                        {' '}{order.shippingAddress.postalCode},
                                        {' '}{order.shippingAddress.city},
                                        {' '}{order.shippingAddress.country}
                                    </p>
                                    {order.isDelivered ? (
                                        <Message variant='success'>Delivered on {order.deliveredAt.substring(0,10)}</Message>
                                    ) : 
                                        <Message variant='warning'>Not deliverd!</Message>
                                    }
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                            {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                        <Message variant='success'>Paid on {order.paidAt.substring(0, 10)}</Message>
                                    ) : 
                                        <Message variant='warning'>Not paid!</Message>
                                    }
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <h2>Order Items</h2>
                                    {order.orderItems.length === 0 ? 
                                        <Message variant='info'>No orders yet! {' '}
                                            <Link style={{textDecoration: 'none'}}
                                                to='/'>Click here to explore items
                                            </Link>
                                        </Message>
                                        :
                                        (
                                            <ListGroup variant='flush'>
                                                {order.orderItems.map((item, index) => (
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
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Shipping Fee:</Col>
                                                <Col>${order.shippingPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Tax Price:</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Total:</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                    {!order.isPaid && (
                                        <ListGroup.Item>
                                            {loadingPay && <Loader />}
                                            {!sdkReady ? (
                                                <Loader />
                                            ) : (
                                                    <PayPalButton
                                                        amount={order.totalPrice}
                                                        onSuccess={successPaymentHandler}
                                                    />  
                                            )
                                            }
                                        </ListGroup.Item>
                                    )}
                                </ListGroup> 
                                {loadingDeliver && <Loader />}
                                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button
                                            type='button'
                                            className='btn-btn w-100'
                                           onClick={deliverOrderHandler} 
                                        >
                                            Mark As Delivered
                                        </Button>
                                    </ListGroup.Item>
                                )}
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
}

export default OrderPage