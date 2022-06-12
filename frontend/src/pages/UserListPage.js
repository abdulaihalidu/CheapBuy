import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { userList, deleteUser } from '../actions/UserActions';


function UserListPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const listUsers = useSelector((state) => state.userList);
    const { error, loading, users } = listUsers;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const userDelete = useSelector((state) => state.userDelete);
    const { success:successDelete } = userDelete;


    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(userList())
        }
        else {
            navigate('/login')
        }
        
    }, [dispatch, userInfo, navigate, successDelete])

    const deleteUserHandler = (userId) => {
        // confirm before deleting
        if (window.confirm(`Are you sure want to to delete this user?`)) {
            dispatch(deleteUser(userId))
        }
    }

  return (
    <div>
        <h1>Users</h1> 
        {loading ? (
              <Loader />
          ) : error ? (
                  <Message variant='danger'>{error}</Message>
          ) : (
                <Table striped hover bordered responsive className='table-sm'>
                          <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>   
                                <th>EMAIL</th>
                                <th>ADMIN</th>
                                <th></th>
                            </tr>          
                    </thead>   
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.isAdmin ? (<i className='fas fa-check' style={{color: 'green'}}></i>) 
                                        : (<i className='fas fa-times' style={{color: 'red'}}></i>)
                                    }
                                </td>
                                <td>
                                    <LinkContainer 
                                        to={`/admin/user/${user._id}/edit`}
                                        style={{textDecoration: 'none'}}
                                    >
                                        <Button className='btn-sm'>
                                            <i className='fas fa-edit'></i>
                                        </Button>
                                    </LinkContainer>
                                    {' '}
                                    <Button 
                                        variant='danger'
                                        className='btn-sm'
                                        onClick={() => deleteUserHandler(user._id)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
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

export default UserListPage