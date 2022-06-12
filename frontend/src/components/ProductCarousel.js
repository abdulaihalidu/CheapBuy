import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Carousel, Image } from 'react-bootstrap';
import Loader from './Loader';
import Message from './Message';
import { listTopProducts } from '../actions/ProductActions';



function ProductCarousel() {
    const dispatch = useDispatch();
    
    const topRatedProducts = useSelector(state => state.topRatedProducts)
    const {error, loading, products} = topRatedProducts

    
    useEffect(() => {
        dispatch(listTopProducts())
    }, [dispatch])

  return (
      loading ? <Loader /> :
          error ? <Message variant='danger'>{error}</Message>
              : (
                  <Carousel
                      pause='hower'
                      className='bg-primary m-2'
                  >
                      {products.map((product) => (
                          <Carousel.Item key={product._id}>
                              <Link
                                  style={{ textDecoration: 'none' }}
                                  to={`/product/${product._id}`}
                              >
                                  <Image src={product.image} alt={product.name} fluid/>
                                  <Carousel.Caption className='carousel-caption'>
                                      <h5>{product.name}  (${product.price})</h5>
                                  </Carousel.Caption>
                              </Link>
                          </Carousel.Item>
                      ))}
                    </Carousel>
                )
  )
}

export default ProductCarousel