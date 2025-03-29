import React, { useContext, useState } from 'react';
import { Container, Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { NavLink, useLocation, useHistory } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "../utils/consts";
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { setTokenInCookie } from "../http/cookieUtils";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const history = useHistory();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [firstName, setFirstName] = useState('');
    const [secondName, setSecondName] = useState('');
    const [lastName, setLastName] = useState('');

    const click = async () => {
        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
            } else {
                data = await registration(email, password, firstName, secondName, lastName, phone);
            }
            user.setUser(data);
            user.setIsAuth(true);

            // Сохраняем токен в куки
            setTokenInCookie(data.token);

            history.push(SHOP_ROUTE);
        } catch (e) {
            alert(e.response.data.message);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: window.innerHeight - 54 }}
        >
            <Card style={{ width: 600 }} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизація' : "Реєстрація"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Введіть ваш email..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    {!isLogin && (
                        <>
                            <Form.Control
                                className="mt-3"
                                placeholder="Введіть ваше ім'я..."
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                            />
                            <Form.Control
                                className="mt-3"
                                placeholder="Введіть ваше по батькові..."
                                value={secondName}
                                onChange={e => setSecondName(e.target.value)}
                            />
                            <Form.Control
                                className="mt-3"
                                placeholder="Введіть ваше прізвище..."
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                            />
                            <Form.Control
                                className="mt-3"
                                placeholder="Введіть ваш телефон..."
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                            />
                        </>
                    )}
                    <Form.Control
                        className="mt-3"
                        placeholder="Введіть ваш пароль..."
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Немає акаунту? <NavLink to={REGISTRATION_ROUTE}>Зареєструйтесь!</NavLink>
                            </div> :
                            <div>
                                Є акаунт? <NavLink to={LOGIN_ROUTE}>Увійдіть!</NavLink>
                            </div>
                        }
                        <Button
                            variant={"outline-success"}
                            onClick={click}
                        >
                            {isLogin ? 'Увійти' : 'Реєстрація'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;
