import React, {createContext} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserStore from "./store/UserStore";
import PetStore from "./store/PetStore";

export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        petProduct: new PetStore(),
    }}>
        <App />
    </Context.Provider>,
  document.getElementById('root')
);

