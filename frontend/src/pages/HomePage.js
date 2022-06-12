import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation} from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';


import Product from '../components/Product';
import Paginate from '../components/Paginate'

import ProductCarousel from '../components/ProductCarousel';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { listProducts } from '../actions/ProductActions';

function HomePage() {
  const dispatch = useDispatch();
  let location = useLocation();
  let keyword = location.search
  
  const productList = useSelector((state) => state.productList)
  const { error, loading, products, page, pages } = productList


  const topRatedProducts = useSelector(state => state.topRatedProducts)
    const { products:topProducts} = topRatedProducts

  useEffect(() => {
    dispatch(listProducts(keyword));

  }, [dispatch, keyword]);

  return (
    <div>
      
      {!keyword && (topProducts.length !== 0) && <ProductCarousel />}
      <h3>Explore products</h3>
      {loading ? <Loader />
        : error ? <Message variant='danger'>{error} </Message>
          : 
          <div>
          <Row>
              {products.map(product =>
              (
                  <Col key={product._id} sm={12}  md={6} lg={4} xl={3}>
                      <Product product={product} />
                  </Col>
              )
              )}
            </Row>
            <Paginate pages={pages} page={page}/>
            </div>
    }
          
    </div>
  )
}

export default HomePage