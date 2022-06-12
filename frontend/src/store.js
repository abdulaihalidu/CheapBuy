import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    productCreateReducer,
    productListReducer,
    productDetailsReducer,
    productUpdateReducer,
    productDeleteReducer,
    productReviewCreateReducer,
    topRatedProductsReducer
} from './reducers/productReducers';

import { cartReducer } from './reducers/cartReducers';
import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    updateProfileReducer,
    userListReducer,
    userDeleteReducer,
    userUpdateReducer,

} from './reducers/userReducers';

import {
    orderCreateReducer,
    OrderListReducer,
    orderDetailsReducer,
    payOrderReducer,
    deliverOrderReducer,
    myOrderListReducer,
    
} from './reducers/OrderReducers';


const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userProfileUpdate: updateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    productCreate: productCreateReducer,
    productList: productListReducer, 
    productDetails: productDetailsReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    productReviewCreate: productReviewCreateReducer,
    topRatedProducts: topRatedProductsReducer,
    cart: cartReducer,

    orderCreate: orderCreateReducer,
    orderList: OrderListReducer,
    orderDetails: orderDetailsReducer,
    orderPay: payOrderReducer,
    orderDeliver: deliverOrderReducer,
    myOrderList: myOrderListReducer,

});

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}
const paymentMethodFromStorage = localStorage.getItem('paymentMethod') ? 
    JSON.parse(localStorage.getItem('paymentMethod')) : {}

const initialState = {
    userLogin: {
        userInfo: userInfoFromStorage,
    },
    cart: {
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
        paymentMethod: paymentMethodFromStorage,
    }
    
};

const middleware = [thunk];

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)));

export default store;


