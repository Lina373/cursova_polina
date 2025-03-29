import React, { useContext, useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Dropdown, Form, Row, Col, Table, Alert } from "react-bootstrap";
import { Context } from "../../index";
import { createPetProduct, fetchCategores, fetchTypes, fetchProducts, deletePetProduct } from "../../http/petProductAPI";
import { observer } from "mobx-react-lite";

const CreatePetProduct = observer(({ show, onHide }) => {
    const { petProduct } = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [file, setFile] = useState(null);
    const [info, setInfo] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(10);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchTypes()
            .then(data => {
                petProduct.setTypes(data);
            })
            .catch(error => {
                console.error("Помилка при завантаженні типів:", error);
            });

        fetchCategores()
            .then(data => {
                petProduct.setCategores(data);
            })
            .catch(error => {
                console.error("Помилка при завантаженні брендів:", error);
            });

        fetchProducts()
            .then(data => {
                if (Array.isArray(data.rows)) {
                    setProducts(data.rows);
                } else {
                    console.error("Продукти не є масивом", data);
                    setProducts([]);
                }
            })
            .catch(error => {
                console.error("Помилка при завантаженні продуктів:", error);
            });
    }, []);

    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    };

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number));
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? { ...i, [key]: value } : i));
    };

    const selectFile = e => {
        setFile(e.target.files[0]);
    };

    const addPetProduct = () => {
        if (!name || !price || !file || !petProduct.selectedType || !petProduct.selectedCategory) {
            setErrorMessage('Будь ласка, заповніть всі обов\'язкові поля.');
            return;
        }
        setErrorMessage('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', `${price}`);
        formData.append('img', file);
        formData.append('categoryId', petProduct.selectedCategory.id);
        formData.append('typeId', petProduct.selectedType.id);
        formData.append('info', JSON.stringify(info));

        createPetProduct(formData).then(data => {
            fetchProducts()
                .then(data => {
                    if (Array.isArray(data.rows)) {
                        setProducts(data.rows);
                    } else {
                        console.error("Продукти після додавання не є масивом", data);
                        setProducts([]);
                    }
                });
        });
    };

    const handleDelete = (id) => {
        deletePetProduct(id)
            .then(() => {
                fetchProducts()
                    .then(data => {
                        if (Array.isArray(data.rows)) {
                            setProducts(data.rows);
                        } else {
                            console.error("Продукти після видалення не є масивом", data);
                            setProducts([]);
                        }
                    });
            })
            .catch(error => {
                console.error("Помилка при видаленні продукту:", error);
                alert("Не вдалося видалити продукт. Спробуйте ще раз.");
            });
    };

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = Array.isArray(products) ? products.slice(indexOfFirstProduct, indexOfLastProduct) : [];

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати товар
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{petProduct.selectedType?.name || "Виберіть тип"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {petProduct.types && petProduct.types.length > 0 ? (
                                petProduct.types.map(type =>
                                    <Dropdown.Item
                                        onClick={() => petProduct.setSelectedType(type)}
                                        key={type.id}
                                    >
                                        {type.name}
                                    </Dropdown.Item>
                                )
                            ) : (
                                <Dropdown.Item disabled>Немає типів</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown className="mt-2 mb-2">
                        <Dropdown.Toggle>{petProduct.selectedCategory?.name || "Виберіть категорію"}</Dropdown.Toggle>
                        <Dropdown.Menu>
                            {petProduct.categores && petProduct.categores.length > 0 ? (
                                petProduct.categores.map(category =>
                                    <Dropdown.Item
                                        onClick={() => petProduct.setSelectedCategory(category)}
                                        key={category.id}
                                    >
                                        {category.name}
                                    </Dropdown.Item>
                                )
                            ) : (
                                <Dropdown.Item disabled>Немає брендів</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="mt-3"
                        placeholder="Введіть назву товару" />

                    <Form.Control
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        onInput={e => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // Оставляем только цифры
                        className="mt-3"
                        placeholder="Введіть вартість товару"
                        required
                    />

                    <Form.Control
                        className="mt-3"
                        type="file"
                        onChange={selectFile} />

                    <hr />

                    <Button
                        variant={"outline-dark"}
                        onClick={addInfo}>
                        Додати нову властивість
                    </Button>

                    {info.map(i =>
                        <Row className="mt-4" key={i.number}>
                            <Col md={4}>
                                <Form.Control
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    placeholder="Введіть назву властивості" />
                            </Col>
                            <Col md={4}>
                                <Form.Control
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                    placeholder="Введіть опис властивості" />
                            </Col>
                            <Col md={4}>
                                <Button
                                    onClick={() => removeInfo(i.number)}
                                    variant={"outline-danger"}>
                                    Видалити
                                </Button>
                            </Col>
                        </Row>
                    )}
                </Form>

                <hr />

                <h5>Список товарів</h5>

                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Назва</th>
                        <th>Ціна</th>
                        <th>Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={product.id}>
                            <td>{indexOfFirstProduct + index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>
                                <Button
                                    variant="outline-danger"
                                    onClick={() => handleDelete(product.id)}
                                    className="ml-2">
                                    Видалити
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>

                <div className="pagination">
                    {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, index) => (
                        <Button
                            key={index}
                            variant="outline-secondary"
                            onClick={() => paginate(index + 1)}
                            className={currentPage === index + 1 ? "active" : ""}>
                            {index + 1}
                        </Button>
                    ))}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрити</Button>
                <Button variant="outline-success" onClick={addPetProduct}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreatePetProduct;
