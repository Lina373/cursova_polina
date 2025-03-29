import React, { useState, useEffect } from 'react';
import { Table, Container, Pagination, Button } from 'react-bootstrap';
import { fetchOrders, deleteOrder } from "../http/petProductAPI";
import CreateCategory from "../components/modals/CreateCategory";
import CreatePetProduct from "../components/modals/CreatePetProduct";
import CreateType from "../components/modals/CreateType";

const Admin = () => {
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [petProductVisible, setPetProductVisible] = useState(false);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                const data = await fetchOrders();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    if (loading) {
        return <Container><h2>Завантаження замовлень...</h2></Container>;
    }

    if (error) {
        return (
            <Container>
                <h2>Помилка завантаження замовлень</h2>
                <p>{error}</p>
            </Container>
        );
    }

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteOrder(orderId);
            setOrders(orders.filter(order => order.id !== orderId));
        } catch (err) {
            alert('Помилка при видаленні замовлення');
        }
    };

    return (
        <Container>
            <Container className="d-flex flex-column">
                <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => setTypeVisible(true)}
                >
                    Додати тип
                </Button>
                <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => setCategoryVisible(true)}
                >
                    Додати категорію
                </Button>
                <Button
                    variant={"outline-dark"}
                    className="mt-4 p-2"
                    onClick={() => setPetProductVisible(true)}
                >
                    Додати товар
                </Button>
                <CreateCategory show={categoryVisible} onHide={() => setCategoryVisible(false)} />
                <CreatePetProduct show={petProductVisible} onHide={() => setPetProductVisible(false)} />
                <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
            </Container>
            <h1>Замовлення</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>№</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Товари</th>
                    <th>Статус</th>
                    <th>Дії</th>
                </tr>
                </thead>
                <tbody>
                {currentOrders.map((order) => {
                    const cartItems = typeof order.cart === 'string' ? JSON.parse(order.cart) : order.cart;
                    return (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>{cartItems.map(item => item.name).join(', ')}</td>
                            <td>{order.status}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteOrder(order.id)}
                                >
                                    Видалити
                                </Button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
            <Pagination>
                {[...Array(totalPages).keys()].map(page => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => paginate(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
};

export default Admin;
