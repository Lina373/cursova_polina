import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";
import { Spinner } from "react-bootstrap";
import { getTokenFromCookie } from './http/cookieUtils';

const App = observer(() => {
    const { user } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getTokenFromCookie();
        if (token) {
            check()
                .then(data => {
                    user.setUser(data);
                    user.setIsAuth(true);
                })
                .catch(() => {
                    user.setUser({});
                    user.setIsAuth(false);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <Spinner animation={"grow"} />;
    }

    return (
        <BrowserRouter>
            <NavBar />
            <AppRouter />
        </BrowserRouter>
    );
});

export default App;
