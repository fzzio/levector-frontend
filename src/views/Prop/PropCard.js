import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Badge,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Fade,
    Form,
    FormGroup,
    FormText,
    FormFeedback,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupButtonDropdown,
    InputGroupText,
    Label,
    Row,
  } from 'reactstrap';
import { isNull } from 'util';
import moment from 'moment';
import defines from '../../defines'
import defaultimg from '../../assets/img/levector.jpg'

class PropCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prop: {
                ID: (this.props.prop.ID).toString().padStart( defines.LVT_NUM_DIGITS, defines.LVT_PAD_CHARACTER),
                name: this.props.prop.name,
                link: `/prop/${this.props.prop.ID}`,
                width: this.props.prop.width,
                height: this.props.prop.height,
                length: this.props.prop.length,
                weight: this.props.prop.weight,
                photo: (this.props.prop.photo) ? this.props.prop.photo : defaultimg,
                modified: moment(this.props.prop.modified).format('YYYY-MM-DD'),
            },
            hasAlert: false,
            alertMessage : '',
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        let alertMessage = '';
        let hasAlert = false;
        if( ( this.props.prop.width === null || this.props.prop.width === -1 ) ){
            alertMessage += 'Peso incorrecto. ';
            hasAlert = true;
        }

        this.setState({ 
            hasAlert: hasAlert,
            alertMessage: alertMessage 
        });
    }

    render() {
        const prop = this.state.prop;
        let alertMessage = null;
        if( this.state.hasAlert ){
            alertMessage =  <Row>
                                <Col xs="12">
                                    <Alert color="warning">
                                        { this.state.alertMessage }
                                    </Alert>
                                </Col>
                            </Row>;
        }
        return (
            <Col xs="12" sm="3" md="3">
                <Card id={prop.ID} className="lvt-card">
                    <CardBody>
                        <Row>
                            <Col md="12">
                                <img 
                                    src={ prop.photo } 
                                    className="rounded img-responsive lvt-img" 
                                    alt={ prop.name }
                                />
                            </Col>
                            <Col sm="12">
                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        <p className="lvt-data-value">
                                            { prop.name }
                                        </p>
                                        <FormText className="lvt-data-field">Nombre</FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm="6" md="6" lg="4">
                                        <p className="lvt-data-value">
                                            { prop.ID }
                                        </p>
                                        <FormText className="lvt-data-field">ID</FormText>
                                    </Col>
                                    <Col sm="6" md="6" lg="3">
                                        <p className="lvt-data-value">
                                            { 
                                                prop.width
                                                ?   prop.width
                                                :   <Badge color="warning">
                                                        <i className="fa fa-question fa-lg"></i>
                                                    </Badge>
                                            }
                                        </p>
                                        <FormText className="lvt-data-field">Ancho</FormText>
                                    </Col>
                                    <Col sm="6" md="6" lg="5">
                                        <p className="lvt-data-value">
                                            { 
                                                prop.height
                                                ?   prop.height
                                                :   <Badge color="warning">
                                                        <i className="fa fa-question fa-lg"></i>
                                                    </Badge>
                                            }
                                        </p>
                                        <FormText className="lvt-data-field">Altura</FormText>
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        { alertMessage }
                        <Row>
                            <Col xs="8">
                                <p className="lvt-data-value">
                                    { prop.modified }
                                </p>
                                <FormText className="lvt-data-field">Modificado</FormText>
                            </Col>
                            <Col xs="4">
                                <Link to={ prop.link } className="btn btn-dark btn-sm btn-block"  target="_blank" color="primary" >
                                    Ver
                                </Link>
                            </Col>
                        </Row>
                    </CardFooter>
                </Card>
            </Col>
        )
    }
}

export default PropCard;