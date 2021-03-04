import React from 'react';

const ReviewItem = (props) => {
    const { name, quantity, img } = props.product;
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
            <br />
            <button className="main-button">Remove</button>
        </div>
    );
};

export default ReviewItem;