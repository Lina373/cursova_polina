import React, { useState, useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { Form, Button, ListGroup } from "react-bootstrap";
import { createType, fetchTypes, deleteType } from "../../http/petProductAPI";

const CreateType = ({ show, onHide }) => {

    const [value, setValue] = useState('');
    const [types, setTypes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        if (show) {
            fetchTypes().then(data => setTypes(data));
        }
    }, [show]);

    const addType = () => {
        if (!value.trim()) {
            alert("Введіть категорія");
            return;
        }

        if (types.some(type => type.name.toLowerCase() === value.toLowerCase())) {
            alert("Така категорія вже існує");
            return;
        }

        createType({ name: value }).then(newType => {
            setTypes([...types, newType]);
            setValue('');
        });
    };

    const removeType = (id) => {
        setErrorMessage('');
        deleteType(id).then(() => {
            setTypes(types.filter(type => type.id !== id));
        }).catch(error => {
            if (error.response && error.response.data.message === 'Тип не можливо видалити') {
                setErrorMessage(error.response.data.message);

                setTimeout(() => {
                    setErrorMessage('');
                }, 2000);
            }
        });
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Додати тип
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                <ListGroup>
                    {types.map(type => (
                        <ListGroup.Item key={type.id} className="d-flex justify-content-between align-items-center">
                            {type.name}
                            <Button variant="outline-danger" size="sm" onClick={() => removeType(type.id)}>
                                Удалить
                            </Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
                <Form className="mt-3">
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Введіть назву типу"
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={onHide}>Закрить</Button>
                <Button variant="outline-success" onClick={addType}>Додати</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateType;
