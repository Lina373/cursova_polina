import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import {Card, Row} from "react-bootstrap";

const CategoryBar = observer(() => {
    const {petProduct} = useContext(Context)

    return (
        <Row className="d-flex">
            {petProduct.categores.map(category =>
                <Card
                    style={{cursor:'pointer'}}
                    key={category.id}
                    className="p-3"
                    onClick={() => petProduct.setSelectedCategory(category)}
                    border={category.id === petProduct.selectedCategory.id ? 'danger' : 'light'}
                >
                    {category.name}
                </Card>
            )}
        </Row>
    );
});

export default CategoryBar;
