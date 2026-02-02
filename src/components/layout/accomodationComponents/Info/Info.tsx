import React from "react";
import { Col, Icon, InfoWrapper, Row, Text, Title } from "./InfoStyled";
import InfoMock from "./InfoList";


const Info: React.FC = () => {
    return (
        <InfoWrapper>
                <Row>
                    {InfoMock.map((item) => (
                        <Col key={item.id} className="last">
                            <Icon>{item.icon}</Icon>
                            <Title>{item.title}</Title>
                            <Text>{item.text}</Text>
                        </Col>
                    ))}
                </Row>
        </InfoWrapper>
    );
};

export default Info;