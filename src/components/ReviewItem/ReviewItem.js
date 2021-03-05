import React from 'react';

const ReviewItem = (props) => {
    const { name, quantity, img, key, price } = props.product;
    const handleRemoveProduct = props.handleRemoveProduct;
    const reviewItemStyle = {
        border: '1px solid gray',
        marginBottom: '5px',
        paddingBottom: '5px',
        marginLeft: '5px'
    }
    return (
        <div style={reviewItemStyle} className="review-item">
            <h4 className="product-name">{name}</h4>
            <p>Quantity: {quantity}</p>
            <p><small>$ {price}</small></p>
            <br />
            <button onClick={() => handleRemoveProduct(key)} className="main-button">Remove</button>
        </div>
    );
};

export default ReviewItem;