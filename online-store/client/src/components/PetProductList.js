import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Row} from "react-bootstrap";
import PetProductItem from "./PetProductItem";

const PetProductList = observer(() => {
    const {petProduct} = useContext(Context)

    return (
        <Row className="d-flex">
            {petProduct.petProducts.map(petProduct =>
                <PetProductItem key={petProduct.id} petProduct={petProduct}/>
            )}
        </Row>
    );
});

export default PetProductList;
