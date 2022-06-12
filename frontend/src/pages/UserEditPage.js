import React, { useState, useEffect } from 'react';
import { Link,  useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/UserActions';
import { USER_UPDATE_RESET } from '../constants/userConstants';


function UserEditPage() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    
    const dispatch = useDispatch();
    
    const navigate = useNavigate();

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, user, error } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading:loadingUpdate, error:errorUpdate, success:successUpdate } = userUpdate;


    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET })
            navigate('/admin/userlist')
        } else {
            if (!user.name || user._id !== Number(id)) {
             dispatch(getUserDetails(id))
            } else {
                setName(user.name)
                setEmail(user.email)
                setIsAdmin(user.isAdmin)
                }
        } 
    }, [dispatch, navigate, id, user, successUpdate])  
    

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({
            _id: id,
            name,
            email,
            isAdmin
        }))
    }
    return (
        <div>
            <Link
                style={{ textDecoration: 'none' }}
                className='btn btn-info my-3'
                to='/admin/userlist'
                
            >
                &#8592;Users
            </Link>
            <FormContainer>
                <h2>Edit user</h2>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                {loading ? (<Loader />)
                    : error ?
                        (
                        <Message variant='danger'>
                            {error}
                        </Message>
                        ) :
                        (
                        <Form onSubmit={submitHandler}>
                            <Form.Group controlId='name'>
                                <Form.Label>Name</Form.Label>
                                <Form.Control
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
                                    type='email'
                                    placeholder='Enter email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    >

                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='idadmin'>
                                <Form.Check
                                    type='checkbox'
                                    label='Has administrative role'
                                    checked={isAdmin}
                                    onChange={(e) => setIsAdmin(e.target.checked)}
                                    >
                                </Form.Check>
                            </Form.Group>
                            <Button className='my-3'
                                type='submit'
                                variant='primary'
                                >
                                    Update
                            </Button>
                        </Form>   
                    )
                }
                
            </FormContainer>
    </div>
    )
}

export default UserEditPage