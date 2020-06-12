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

class LocationCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: {
                ID: (this.props.location.ID).toString().padStart( defines.LVT_NUM_DIGITS, defines.LVT_PAD_CHARACTER),
                name: this.props.location.name,
                link: `/location/${this.props.location.ID}`,
                photo: (this.props.location.photo) ? this.props.location.photo : defaultimg,
                modified: moment(this.props.location.modified).format('YYYY-MM-DD'),
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
        
        // if( ( this.props.location.gender === null ) ){
        //     alertMessage += 'Género incorrecto. ';
        //     hasAlert = true;
        // }

        this.setState({ 
            hasAlert: hasAlert,
            alertMessage: alertMessage 
        });
    }

    render() {
        const location = this.state.location;
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
                <Card id={location.ID} className="lvt-card">
                    <CardBody>
                        <Row>
                            <Col md="12">
                                <img 
                                    src={ location.photo } 
                                    className="rounded img-responsive lvt-img" 
                                    alt={ location.name }
                                />
                            </Col>
                            <Col sm="12">
                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        <p className="lvt-data-value">
                                            { location.name }
                                        </p>
                                        <FormText className="lvt-data-field">Nombre</FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm="6" md="6" lg="4">
                                        <p className="lvt-data-value">
                                            { location.ID }
                                        </p>
                                        <FormText className="lvt-data-field">ID</FormText>
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
                                    { location.modified }
                                </p>
                                <FormText className="lvt-data-field">Modificado</FormText>
                            </Col>
                            <Col xs="4">
                                <Link to={ location.link } className="btn btn-dark btn-sm btn-block"  target="_blank" color="primary" >
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

export default LocationCard;