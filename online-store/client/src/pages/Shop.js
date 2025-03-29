import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TypeBar from "../components/TypeBar";
import CategoryBar from "../components/CategoryBar";
import PetProductList from "../components/PetProductList";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { fetchCategores, fetchProducts, fetchTypes } from "../http/petProductAPI";
import Pages from "../components/Pages";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Shop = observer(() => {
    const { petProduct } = useContext(Context);

    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [showVideoPopup, setShowVideoPopup] = useState(true);

    useEffect(() => {
        const initialTypeId = 1;
        const initialCategoryId = 1;

        fetchTypes().then(data => {
            petProduct.setTypes(data);
            petProduct.setSelectedType(data.find(type => type.id === initialTypeId) || { id: initialTypeId });
        });

        fetchCategores().then(data => {
            petProduct.setCategores(data);
            petProduct.setSelectedCategory(data.find(category => category.id === initialCategoryId) || { id: initialCategoryId });
        });

        fetchProducts(1, 2, initialTypeId, initialCategoryId, "").then(data => {
            petProduct.setPetProducts(data.rows);
            petProduct.setTotalCount(data.count);
        });
    }, []);

    useEffect(() => {
        if (isSearchActive) {
            fetchProducts(
                petProduct.page,
                20,
                null,
                null,
                searchQuery
            ).then(data => {
                petProduct.setPetProducts(data.rows);
                petProduct.setTotalCount(data.count);
            });
        } else {
            fetchProducts(
                petProduct.page,
                2,
                petProduct.selectedType?.id,
                petProduct.selectedCategory?.id,
                ""
            ).then(data => {
                petProduct.setPetProducts(data.rows);
                petProduct.setTotalCount(data.count);
            });
        }
    }, [petProduct.page, petProduct.selectedType, petProduct.selectedCategory, searchQuery, isSearchActive]);


    const handleSearch = () => {
        if (searchQuery.trim() !== "") {
            setIsSearchActive(true);
            fetchProducts(
                petProduct.page,
                20,
                petProduct.selectedType?.id,
                petProduct.selectedCategory?.id,
                searchQuery
            ).then(data => {
                petProduct.setPetProducts(data.rows);
                petProduct.setTotalCount(data.count);
            });
        }
    };


    const handleClear = () => {
        setSearchQuery("");
        setIsSearchActive(false);
    };

    const hasProducts = Array.isArray(petProduct.petProducts) && petProduct.petProducts.length > 0;

    return (
        <Fragment>
            {showVideoPopup && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        width: '320px',
                        height: '180px',
                        zIndex: 9999,
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        boxShadow: '0px 2px 15px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/gcUHp8Wm7D0"
                        title="YouTube video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '10px' }}
                    ></iframe>
                    <button
                        onClick={() => setShowVideoPopup(false)}
                        style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: '#888',
                            padding: '5px',
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <div style={{ display: 'flex' }}>
                <div style={{ width: '20%' }}>
                    <img
                        src="https://cdn.pixabay.com/photo/2021/01/30/15/15/dog-5964181_960_720.jpg"
                        alt="Пес"
                        style={{ width: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                </div>

                <div style={{ flex: 1, padding: '20px' }}>
                    <Container>
                        <div className="mb-3 mt-3">
                            <Form.Control
                                type="text"
                                placeholder="Пошук за назвою продукту"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button className="mt-2" onClick={handleSearch}>
                                Пошук
                            </Button>
                            <Button className="mt-2 ms-2" variant="secondary" onClick={handleClear}>
                                Очистити
                            </Button>
                        </div>

                        <Row className="mt-2">
                            <Col md={3}>
                                {!isSearchActive && <TypeBar />}
                            </Col>
                            <Col md={9}>
                                {!isSearchActive && <CategoryBar />}
                                {hasProducts ? (
                                    <>
                                        <PetProductList />
                                        <Pages />
                                    </>
                                ) : (
                                    <p>Товари не знайдено за цими параметрами.</p>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div style={{ width: '20%' }}>
                    <img
                        src="https://cdn.pixabay.com/photo/2017/07/22/15/21/cat-2528935_960_720.jpg"
                        alt="Кіт"
                        style={{ width: '100%', objectFit: 'cover', objectPosition: 'top' }}
                    />
                </div>
            </div>
        </Fragment>
    );
});

export default Shop;
