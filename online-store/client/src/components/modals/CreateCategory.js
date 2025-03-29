import React, { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { Button, Form, ListGroup } from "react-bootstrap";
import { createCategory, deleteCategory, fetchCategores } from "../../http/petProductAPI";

const CreateCategory = ({ show, onHide }) => {
    const [value, setValue] = useState('');
    const [categores, setCategores] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (show) {
            fetchCategores()
                .then(data => setCategores(data))
                .catch(err => console.error("Ошибка загрузки брендов:", err));
        }
    }, [show]);

    // Добавление нового бренда
    const addCategory = () => {
        if (!value.trim()) {
            alert("Введіть назву категорії!");
            return;
        }

        if (categores.some(category => category.name.toLowerCase() === value.toLowerCase())) {
            alert("Така категорія вже існує!");
            return;
        }

        createCategory({ name: value })
            .then(newcategory => {
                setCategores([...categores, newcategory]);
                setValue('');
            })
            .catch(err => {
                console.error("Ошибка добавления бренда:", err);
                alert("Не вдалося додати категорію.");
            });
    };

    // Удаление бренда
    const removeCategory = (id) => {
        setErrorMessage('');
        deleteCategory(id)
            .then(() => {
                setCategores(categores.filter(category => category.id !== id));
            })
            .catch(err => {
                console.error("Ошибка удаления бренда:", err);
                if (err.response?.data?.message === 'Категорію не можливо видалити') {
                    setErrorMessage(err.response.data.message);
                    setTimeout(() => setErrorMessage(''), 2000);
                }
            });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати категорію
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <ListGroup>
                    {categores.map(category => (
                        <ListGroup.Item key={category.id} className="d-flex justify-content-between align-items-center">
                            {category.name}
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeCategory(category.id)}
                            >
                                Видалити
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Form className="mt-3">
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Введіть назву категорії"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрити</Button>
                <Button variant="outline-success" onClick={addCategory}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCategory;
