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
import defines from '../../../defines'

const getBadge = (status) => {
    return status === defines.LVT_STATUS_ACTIVE ? 'success' :
      status === defines.LVT_STATUS_INACTIVE ? 'secondary' :
            'primary'
}
class PersonCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            person: {
                ID: (this.props.person.ID).toString().padStart( defines.PERSON_ID_DIGITS, defines.PERSON_PAD_CHARACTER),
                fullname: this.props.person.firstname + ' ' + this.props.person.lastname,
                link: `/person/${this.props.person.ID}`,
                age: this.props.person.age,
                photo: this.props.person.photo,
                gender: this.props.person.gender,
                modified: moment(this.props.person.modified).format('YYYY-MM-DD'),
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
        if( ( this.props.person.age === null || this.props.person.age === -1 ) ){
            alertMessage += 'Edad incorrecta. ';
            hasAlert = true;
        }
        if( ( this.props.person.gender === null ) ){
            alertMessage += 'Género incorrecto. ';
            hasAlert = true;
        }

        this.setState({ 
            hasAlert: hasAlert,
            alertMessage: alertMessage 
        });
    }

    render() {
        const person = this.state.person;
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
            <Col xs="12" sm="4" md="3">
                <Card id={person.ID} className="person-card">
                    <CardBody>
                        <Row>
                            <Col md="12">
                                <img 
                                    src={ person.photo } 
                                    className="rounded img-responsive lvt-img" 
                                    alt={ person.fullname }
                                />
                            </Col>
                            <Col sm="12">
                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        <p className="person-data-value">
                                            { person.fullname }
                                        </p>
                                        <FormText className="person-data-field">Nombre</FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col xs="4" md="4">
                                        <p className="person-data-value">
                                            { person.ID }
                                        </p>
                                        <FormText className="person-data-field">ID</FormText>
                                    </Col>
                                    <Col xs="3" md="3">
                                        <p className="person-data-value">
                                            { person.age } 
                                        </p>
                                        <FormText className="person-data-field">Edad</FormText>
                                    </Col>
                                    <Col xs="5" md="5">
                                        <p className="person-data-value">
                                            { person.gender }
                                        </p>
                                        <FormText className="person-data-field">Género</FormText>
                                    </Col>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter>
                        { alertMessage }
                        <Row>
                            <Col xs="8">
                                <p className="person-data-value">
                                    { person.modified }
                                </p>
                                <FormText className="person-data-field">Modificado</FormText>
                            </Col>
                            <Col xs="4">
                                <Link to={ person.link } className="btn btn-dark btn-sm btn-block" color="primary" >
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

export default PersonCard;