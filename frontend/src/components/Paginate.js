import React from 'react'

import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';



function Paginate({ pages, page, keyword = '', isAdmin = false }) {
    
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
  
    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((i) => (
                    <LinkContainer
                        key={i + 1}
                        to={!isAdmin ? `/?keyword=${keyword}&page=${i + 1}` :
                            `/admin/productlist/?keyword=${keyword}&page=${i + 1}`}
                    >
                        <Pagination.Item active={i+1 === page}>
                            {i+1}
                        </Pagination.Item>
                    </LinkContainer>
                ))}
            </Pagination>
        )
  )
}

export default Paginate