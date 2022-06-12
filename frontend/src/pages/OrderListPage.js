import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { listOrders } from '../actions/OrderActions';


function OrderListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderList = useSelector((state) => state.orderList);
    const { error, loading, orders } = orderList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listOrders())
        }
        else {
            navigate('/login')
        }
        
    }, [dispatch, userInfo, navigate])

  return (
    <div>
        <h2>Orders</h2> 
        {loading ? (
              <Loader />
          ) : error ? (
                  <Message variant='danger'>{error}</Message>
          ) : (
                <Table striped hover bordered responsive className='table-sm'>
                          <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER</th>   
                                <th>DATE</th>
                                <th>TOTAL PRICE</th>
                                <th>PAID</th>
                                <th>DELIVERED</th>
                                <th>DETAILS</th>
                            </tr>          
                    </thead>   
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user && order.user.name}</td>
                                <th>{order.createdAt.substring(0,10)}</th>
                                <th>{order.totalPrice}</th>
                                <td>
                                    {order.isPaid ? (order.paidAt.substring(0,10)) 
                                        : (<i className='fas fa-times' style={{color: 'red'}}></i>)
                                    }
                                </td>
                                <td>
                                    {order.isDelivered ? (order.deliveredAt.substring(0,10)) 
                                        : (<i className='fas fa-times' style={{color: 'red'}}></i>)
                                    }
                                </td>
                                <td>
                                    <LinkContainer 
                                        to={`/order/${order._id}`}
                                        style={{textDecoration: 'none'}}
                                    >
                                        <Button className='btn-sm'>
                                            <i className='fas fa-info-circle'></i>
                                        </Button>
                                    </LinkContainer>
                                    
                                </td>
                           </tr>
                       ))}       
                    </tbody>      
               </Table>
            )
        }
    </div>
  )
}

export default OrderListPage