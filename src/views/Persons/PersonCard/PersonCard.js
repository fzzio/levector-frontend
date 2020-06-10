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
import defines from '../../../defines'
import defaultimg from '../../../assets/img/levector.jpg'

class PersonCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            person: {
                ID: (this.props.person.ID).toString().padStart( defines.LVT_NUM_DIGITS, defines.LVT_PAD_CHARACTER),
                fullname: this.props.person.firstname + ' ' + this.props.person.lastname,
                link: `/person/${this.props.person.ID}`,
                age: ( this.props.person.age > 0 ) ? this.props.person.age : 0,
                photo: (this.props.person.photo) ? this.props.person.photo : defaultimg,
                gender: ( this.props.person.gender !== null ) ? this.props.person.gender : 0,
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
            <Col xs="12" sm="3" md="3">
                <Card id={person.ID} className="lvt-card">
                    <CardBody>
                        <Row>
                            <Col md="12" className="text-center">
                                <div className="text-center lvt-img-container">
                                    <Link to={ person.link } className=""  target="_blank" >
                                        <img
                                            src={ person.photo }
                                            className="rounded img-responsive lvt-img"
                                            alt={ person.fullname }
                                        />
                                    </Link>
                                </div>
                            </Col>
                            <Col sm="12">
                                <FormGroup row>
                                    <Col xs="12" md="12">
                                        <Link to={ person.link } className="lvt-link-1"  target="_blank" >
                                            <p className="lvt-data-value">
                                                { person.fullname }
                                            </p>
                                        </Link>
                                        <FormText className="lvt-data-field">Nombre</FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col sm="6" md="6" lg="4">
                                        <p className="lvt-data-value">
                                            { person.ID }
                                        </p>
                                        <FormText className="lvt-data-field">ID</FormText>
                                    </Col>
                                    <Col sm="6" md="6" lg="3">
                                        <p className="lvt-data-value">
                                            { 
                                                person.age
                                                ?   person.age
                                                :   <Badge color="warning">
                                                        <i className="fa fa-question fa-lg"></i>
                                                    </Badge>
                                            }
                                        </p>
                                        <FormText className="lvt-data-field">Edad</FormText>
                                    </Col>
                                    <Col sm="6" md="6" lg="5">
                                        <p className="lvt-data-value">
                                            { 
                                                person.gender
                                                ?   person.gender
                                                :   <Badge color="warning">
                                                        <i className="fa fa-question fa-lg"></i>
                                                    </Badge>
                                            }
                                        </p>
                                        <FormText className="lvt-data-field">Género</FormText>
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
                                    { person.modified }
                                </p>
                                <FormText className="lvt-data-field">Modificado</FormText>
                            </Col>
                            <Col xs="4">
                                <Link to={ person.link } className="btn btn-dark btn-sm btn-block"  target="_blank" color="primary" >
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