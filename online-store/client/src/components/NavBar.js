import React, { useContext } from 'react';
import { Context } from "../index";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE, BASKET_ROUTE } from "../utils/consts";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import Container from "react-bootstrap/Container";
import { useHistory } from 'react-router-dom';
import { removeTokenFromCookie } from '../http/cookieUtils';

const NavBar = observer(() => {
    const { user } = useContext(Context);
    const history = useHistory();
    const logOut = () => {
        removeTokenFromCookie();

        user.setUser({});
        user.setIsAuth(false);

        window.location.reload();
    };


    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <NavLink style={{ color: 'white' }} to={SHOP_ROUTE}>PetShop</NavLink>
                {user.isAuth ? (
                    <Nav className="ml-auto" style={{ color: 'white' }}>
                        {user.user.role === "ADMIN" && (
                            <Button
                                variant={"outline-light"}
                                onClick={() => history.push(ADMIN_ROUTE)}
                            >
                                Адмін панель
                            </Button>
                        )}
                        <Button
                            variant={"outline-light"}
                            onClick={() => logOut()}
                            className="ml-2"
                        >
                            Вийти
                        </Button>
                    </Nav>
                ) : (
                    <Nav className="ml-auto" style={{ color: 'white' }}>
                        <Button variant={"outline-light"} onClick={() => history.push(LOGIN_ROUTE)}>Авторизація</Button>
                    </Nav>
                )}

                {user.isAuth && (
                    <Nav className="ml-auto">
                        <NavLink to={BASKET_ROUTE}>
                            <Button variant="outline-light">Корзина</Button>
                        </NavLink>
                    </Nav>
                )}
            </Container>
        </Navbar>
    );
});

export default NavBar;
