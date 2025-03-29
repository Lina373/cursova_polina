import React from 'react';
import { Card, Col } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import star from '../assets/star.png';
import { useHistory } from "react-router-dom";
import { PET_STORE_ROUTE } from "../utils/consts";

const PetProductItem = ({ petProduct }) => {
    const history = useHistory();

    return (
        <Col md={3} className={"mt-3"} onClick={() => history.push(PET_STORE_ROUTE + '/' + petProduct.id)}>
            <Card style={{ width: "100%", cursor: 'pointer' }} border={"light"}>
                <div style={{ maxHeight: '300px', overflow: 'hidden' }}>
                    <Image
                        src={process.env.REACT_APP_API_URL + petProduct.img}
                        style={{
                            objectFit: 'cover',
                            height: '100%',
                            width: '100%',
                            objectPosition: 'center',
                        }}
                    />
                </div>
                <div>{petProduct.name}</div>
            </Card>
        </Col>
    );
};

export default PetProductItem;
