import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Image, Row, Toast } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { fetchOnePetProduct } from '../http/petProductAPI';
import Cookies from 'js-cookie';

const PetProductPage = () => {
    const [petProduct, setPetProduct] = useState({ info: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        fetchOnePetProduct(id)
            .then((data) => {
                setPetProduct(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError('Помилка при завантаженні товару');
                setIsLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        const token = Cookies.get('token');

        if (!token) {
            alert('Для покупки потрібно авторизуватись!');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const productIndex = cart.findIndex(item => item.id === petProduct.id);

        if (productIndex !== -1) {
            cart[productIndex].quantity += 1;
        } else {
            cart.push({ ...petProduct, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        setShowToast(true);
    };


    if (isLoading) {
        return <div>Завантаження...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col md={4}>
                    <Image
                        width="auto"
                        height={300}
                        src={process.env.REACT_APP_API_URL + petProduct.img}
                        alt={petProduct.name}
                        style={{ maxHeight: '300px', width: 'auto', objectFit: 'contain' }}
                    />
                </Col>
                <Col md={4}>
                    <Row className="d-flex flex-column align-items-center">
                        <h2>{petProduct.name}</h2>
                    </Row>
                </Col>
                <Col md={4}>
                    <Card
                        className="d-flex flex-column align-items-center justify-content-around"
                        style={{ width: 300, height: 300, fontSize: 32, border: '5px solid lightgray' }}
                    >
                        <h3>Ціна: {petProduct.price} грн.</h3>
                        <Button variant={"outline-dark"} onClick={handleAddToCart}>
                            Додати до кошика
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h1>Характеристики</h1>
                {petProduct.info.map((info, index) => (
                    <Row
                        key={info.id}
                        style={{ padding: 10 }}
                    >
                        <span><b>{info.title}:</b>  {info.description}</span>
                    </Row>
                ))}
            </Row>

            <Toast
                style={{ position: 'absolute', top: '20px', right: '20px' }}
                show={showToast}
                onClose={() => setShowToast(false)}
                delay={3000}
                autohide
            >
                <Toast.Body>Товар додано до кошика!</Toast.Body>
            </Toast>
        </Container>

    );
};

export default PetProductPage;
