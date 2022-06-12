import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Col, Row } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Paginate from '../components/Paginate';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
    createProduct,
    listProducts,
    deleteProduct
} from '../actions/ProductActions';

import { PRODUCT_CREATE_RESET } from '../constants/productConstants';

function ProductListPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const productCreate = useSelector((state) => state.productCreate);
    const {
        error: errorCreate,
        loading: loadingCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;

    const productList = useSelector((state) => state.productList);
    const { error, loading, products, page, pages } = productList;

    const productDelete = useSelector((state) => state.productDelete);
    const { error:errorDelete, loading:loadingDelete, success:successDelete } = productDelete;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    let keyword = useLocation().search

    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        
        if (!userInfo.isAdmin) {
            navigate('/login')
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`) 

        } else {
            dispatch(listProducts(keyword))
        }
    }, [dispatch,
        userInfo,
        navigate,
        successDelete,
        createdProduct,
        successCreate,
        keyword
    ])

    const deleteProductHandler = (productId) => {
        // confirm before deleting
        if (window.confirm(`Proceed to delete this product?`)) {
            dispatch(deleteProduct(productId))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    }

  return (
    <div>
        <Row className='align-items-center'>
              <Col>
                  <h1>Products</h1>
              </Col> 
              <Col className='text-right'>
                  <Button
                      className='my-3'
                      onClick={createProductHandler}
                  >
                    <i className='fas fa-plus'></i> Create product  
                  </Button>
              </Col>
        </Row>
          {loadingDelete && <Loader />}
          {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
          {loadingCreate && <Loader />}
          {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
          {loading ? (
              <Loader />
          ) : error ? (
                  <Message variant='danger'>{error}</Message>
              ) : (
                <div>
                <Table striped hover bordered responsive className='table-sm'>
                          <thead>
                            <tr>
                                <th>ID</th>
                                <th>NAME</th>   
                                <th>BRAND</th>
                                <th>CATEGORY</th>
                                <th>PRICE</th>
                                <th></th>
                            </tr>          
                    </thead>   
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id}</td>
                                <td>{product.name}</td>
                                <td>{product.brand}</td>
                                <td>{product.category}</td>
                                <td>${product.price}</td>
                                <td>
                                    <LinkContainer 
                                        to={`/admin/product/${product._id}/edit`}
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
                                        onClick={() => deleteProductHandler(product._id)}
                                    >
                                        <i className='fas fa-trash'></i>
                                    </Button>
                                </td>
                           </tr>
                       ))}       
                    </tbody>      
                </Table>
                <Paginate page={page} pages={pages} isAdmin={true}/>       
                 </div>      
            )
        }
    </div>
  )
}

export default ProductListPage