import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { getTokenFromCookie } from "../http/cookieUtils";

const Basket = () => {
    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const token = getTokenFromCookie();

        if (!token) {
            setLoading(false);
            return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        fetch(`http://localhost:5000/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setUser(data);
                }
            })
            .catch(error => {
                alert('Помилка при отриманні даних користувача.');
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(savedCart);
    }, []);

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCart(updatedCart);
    };

    const handleCheckoutForUser = async () => {
        if (cart.length === 0) {
            alert('Ваш кошик порожній!');
            return;
        }

        const orderData = {
            userId: user.id,
            cart,
            email: user.email,
            phone: user.phone,
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`Дякуємо за покупку! Ваше замовлення оформлено.`);
                localStorage.removeItem('cart');
                setCart([]);
                history.push('/');
            } else {
                alert(`Помилка при відправці замовлення: ${result.message}`);
            }
        } catch (error) {
            alert('Виникла помилка при оформленні замовлення.');
        }
    };

    if (loading) {
        return <Spinner animation="border" variant="primary" />;
    }

    return (
        <Container>
            <h1>Ваш кошик</h1>
            {cart.length === 0 ? (
                <p>Кошик порожній</p>
            ) : (
                <Row>
                    {cart.map((item) => (
                        <Col key={item.id} md={4}>
                            <Card style={{ marginBottom: '20px' }}>
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                    <Card.Text>Ціна: {item.price} грн.</Card.Text>
                                    <Button variant="danger" onClick={() => handleRemoveFromCart(item.id)}>
                                        Видалити
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {cart.length > 0 && (
                <>
                    <h3>Загальна вартість: {cart.reduce((total, item) => total + item.price * item.quantity, 0)} грн.</h3>
                    {user ? (
                        <Button variant="success" onClick={handleCheckoutForUser}>
                            Оформити замовлення
                        </Button>
                    ) : (
                        <p>Для оформлення замовлення ви повинні бути авторизовані.</p>
                    )}
                </>
            )}
        </Container>
    );
};

export default Basket;
