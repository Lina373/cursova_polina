import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import cartIcon from '../assets/cart-icon.png';

const CartIcon = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const count = cart.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
    }, []);

    return (
        <Link to="/cart">
            <Button variant="outline-dark" style={{ position: 'relative' }}>
                <img src={cartIcon} alt="Корзина" width={30} height={30} />
                {cartCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            color: 'white',
                            padding: '2px 6px',
                            fontSize: '12px',
                        }}
                    >
                        {cartCount}
                    </span>
                )}
            </Button>
        </Link>
    );
};

export default CartIcon;
