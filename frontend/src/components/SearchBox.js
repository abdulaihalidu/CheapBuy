import React, {useState} from 'react'

import { Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';


function SearchBox() {
    
    const [keyword, setKeyword] = useState('');

    let navigate = useNavigate();
    let location = useLocation();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword) {
            navigate(`/?keyword=${keyword}&page=1`)
        }else {
           navigate(location.pathname)
        }
    }

  return (
    <Form onSubmit={submitHandler}  style={{ display: "flex" }}>
          <Form.Control
              className='mr-sm-2 ml-sm-5'
              type='text'
              name='q'
              onChange={(e) => setKeyword(e.target.value)}
          ></Form.Control>
          <Button
              style={{ marginLeft: "auto" }}
              className='m-1'
              type='submit'
              variant='outline-success'
          >
              Search
          </Button>
    </Form>
  )
}

export default SearchBox;