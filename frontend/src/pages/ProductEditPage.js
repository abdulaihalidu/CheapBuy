import React, { useState, useEffect } from 'react';
import { Link,  useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import axios from 'axios';

import Loader from '../components/Loader';
import Message from '../components/Message';
import FormContainer from '../components/FormContainer';
import { productDetails, updateProduct } from '../actions/ProductActions';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

function ProductEditPage() {
    const { id } = useParams(); // product id  from the url

    const [name, setName] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setcountInStock] = useState(0);
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const dispatch = useDispatch();
    
    const navigate = useNavigate();

    const productD = useSelector((state) => state.productDetails);
    const { loading, error, product } = productD;

    const productUpdate = useSelector((state) => state.productUpdate)
    const {
        loading: loadingUpdate,
        error: errorUpdate, success:
        successUpdate
    } = productUpdate


    useEffect(() => {
        
        if (successUpdate) {
            dispatch({
                type: PRODUCT_UPDATE_RESET
            })
            navigate('/admin/productlist')
        } else {
            if (!product.name || product._id !== Number(id)) {
                dispatch(productDetails(id))
            } else {
                setName(product.name)
                setBrand(product.brand)
                setCategory(product.category)
                setcountInStock(product.countInStock)
                setPrice(product.price)
                setDescription(product.description)
                setImage(product.image)
            }
        }
        
    }, [dispatch, navigate, id, product, successUpdate])  
    

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(
            updateProduct({
                _id: id,
                name,
                brand,
                category,
                countInStock,
                price,
                description  
            })
        )
    }

    const fileUploadHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        formData.append('product_id', id)

        setUploading(true)

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post(
                '/api/products/upload/',
                formData, config
            )
            setImage(data)
            setUploading(false)

        } catch(error) {
            setUploading(false)
        }
    }


    return (
        <div>
            <Link
                style={{ textDecoration: 'none' }}
                className='btn btn-info my-3'
                to='/admin/productlist'
                
            >
                &#8592;Products
            </Link>
            <FormContainer>
                <h2>Edit Product</h2>
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
                            <Form.Group controlId='brand'>
                                <Form.Label>Brand</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter brand'
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    >
                                </Form.Control>
                            </Form.Group>  
                            <Form.Group controlId='category'>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Category'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    >
                                </Form.Control>
                            </Form.Group> 
                            <Form.Group controlId='countinstock'>
                                <Form.Label>Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter stock'
                                    value={countInStock}
                                    onChange={(e) => setcountInStock(e.target.value)}
                                    >
                                </Form.Control>
                            </Form.Group> 
                            <Form.Group controlId='price'>
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter price'
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    >
                                </Form.Control>
                            </Form.Group> 
                            <Form.Group controlId='description'>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    >
                                </Form.Control>
                            </Form.Group> 
                            <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter image url'
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    >
                                </Form.Control>
                                <Form.Control
                                    type='file'
                                    
                                    onChange={fileUploadHandler}
                                >     
                                </Form.Control> 
                                {uploading && <Loader />}   
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

export default ProductEditPage