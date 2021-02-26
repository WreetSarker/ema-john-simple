import React from 'react';

const Cart = (props) => {
    const cart = props.cart;
    const total = cart.reduce((i, j) => i + parseFloat(j.price), 0);
    let shipping = 0;
    if (total > 35) {
        shipping = 0;
    } else if (total > 15) {
        shipping = 4.99;
    } else {
        shipping = 12.99;
    }
    return (
        <div>
            <h4>Order Summary</h4>
            <p>Items ordered: {cart.length}</p>
            <p><small>Shipping cost: {shipping}</small></p>
            <p>Total price: ${(total + shipping).toFixed(2)}</p>
        </div>
    );
};

export default Cart;