import React, { Component } from 'react';

import CustomModal from '../Notifications/Modals/CustomModal';
import CustomField from '../CustomField/CustomField';
import CustomSelect from '../CustomField/CustomSelect';

import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, FormText, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row } from 'reactstrap';
import labels from '../../labels';
import defines from '../../defines';



class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible : false,
            fields:{
                uname:'',
                utype:1,
                utypeName: labels.LVT_LABEL_UTILERIA,
                uheight: 0,
                uwidth: 0,
                ulength: 0,
                uobservations:'',
                category: 0,
                ctype:0
            },
            modal:{
                modalType : 'primary',
                modalTitle : labels.LVT_MODAL_DEFAULT_TITLE,
                modalBody : 'Body',
                modalOkButton : labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                modalCancelButton : labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
                okFunctionState:null
            },
        }
    }

    handleUtileriaTypeChange = (e) => {

        let temp_fields = this.state.fields;
        temp_fields.utype = e.target.value;

        if (e.target.value == 1)
            temp_fields.utypeName = labels.LVT_LABEL_UTILERIA
        else
            temp_fields.utypeName = labels.LVT_LABEL_VESTUARIO
        
        this.setState( { fields:temp_fields } )

    }

    handleInputChange = (e) => {
        let temp_fields = this.state.fields;
        temp_fields[e.target.id] = e.target.value;
        this.setState( { fields:temp_fields } )
    }

    handleChange = ( e ) => {
        console.log('---- value : ', e.target.value);
    }

    handleSubmit = (event)=>{
        event.preventDefault();
        console.log('------- HANDLE SUBMIT -------')        
    }

    inputChangeHandler(e) {
        console.log('------- HANDLE InPUT CHANGE -------')        
        // let formFields = {...this.state.formFields};
        // formFields[e.target.name] = e.target.value;
        // this.setState({ 
        //   formFields:formFields
        // });
    }

    render() {
        return(
        <div className="animated fadeIn">
            { this.state.modalVisible &&
                <CustomModal
                    modalType = {this.state.modal.modalType}
                    modalTitle = {this.state.modal.modalTitle}
                    modalBody = {this.state.modal.modalBody}
                    labelOkButton = {this.state.modal.modalOkButton}
                    labelCancelButton = {this.state.modal.modalCancelButton}
                    okFunction = {this.state.modal.okFunctionState}
                />
            }
            <Form method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-person" onSubmit={this.handleSubmit} >
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <strong>Información</strong> De Utilería
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="uname">Nombre</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="text"
                                            id="uname"
                                            name="uname"
                                            placeholder="Nueva Utilería"
                                            autoComplete="nope"
                                            value={this.state.fields.uname}
                                            onChange = {this.handleInputChange}
                                        />
                                        <FormText color="muted">Nombre del artículo </FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="utype">Tipo</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type = "select" 
                                            name = "utype"
                                            id = "utype"
                                            onChange = { this.handleUtileriaTypeChange } 
                                            value = {this.state.fields.utype}
                                            >
                                            { defines.UTILERIA_TYPE.map( (utileria, i) =>
                                                <option key={i} value = { parseInt(utileria.value) }>
                                                    {utileria.name}
                                                </option>
                                                )
                                            }
                                        </Input>
                                        <FormText color="muted">Tipo de utilería</FormText>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="category">Categoría</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type = "select" 
                                                name = "category"
                                                id = "category"
                                                onChange = { this.handleChange } 
                                                value = {this.state.fields.category}
                                                >
                                                {  this.state.fields.utype == 1 ?
                                                    defines.UTILERIA_CATEGORIES.map( (categoria, i) =>
                                                    <option key={i} value = { parseInt(categoria.value) }>
                                                        {categoria.name}
                                                    </option>
                                                    )
                                                    :
                                                    defines.VESTUARIO_CATEGORIES.map( (categoria, i) =>
                                                    <option key={i} value = { parseInt(categoria.value) }>
                                                        {categoria.name}
                                                    </option>
                                                    )
                                                }
                                            </Input>
                                            <FormText color="muted">Categorice el artículo</FormText>
                                        </Col>
                                    </FormGroup>
                                <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="uheight">Alto</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    id="uheight"
                                                    name="uheight"
                                                    placeholder="Nueva Utilería"
                                                    autoComplete="nope"
                                                    value={this.state.fields.uheight}
                                                    onChange = {this.handleInputChange}
                                                />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{defines.LVT_HEIGHT_UNIT}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FormText color="muted">Alto utilería</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="uwidth">Ancho</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    id="uwidth"
                                                    name="uwidth"
                                                    placeholder="Nueva Utilería"
                                                    autoComplete="nope"
                                                    value={this.state.fields.uwidth}
                                                    onChange = {this.handleInputChange}
                                                />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{defines.LVT_HEIGHT_UNIT}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FormText color="muted">Ancho de la utilería</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="ulength">Largo</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <InputGroup>
                                                <Input
                                                    type="text"
                                                    id="ulength"
                                                    name="ulength"
                                                    placeholder="Nueva Utilería"
                                                    autoComplete="nope"
                                                    value={this.state.fields.ulength}
                                                    onChange = {this.handleInputChange}
                                                />
                                                <InputGroupAddon addonType="append">
                                                    <InputGroupText>{defines.LVT_HEIGHT_UNIT}</InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FormText color="muted">Largo de la utilería</FormText>
                                        </Col>
                                    </FormGroup>
                                    
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <strong>Complementarios</strong> Observaciones
                            </CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="uobservations">Observaciones</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input
                                            type="textarea"
                                            name="uobservations"
                                            id="uobservations"
                                            rows="4"
                                            placeholder="Ingrese observaciones del artículo"
                                            onChange = {this.handleInputChange}
                                        />
                                    <FormText color="muted">Comentarios y observaciones referentes a la ficha ingresada</FormText>
                                    </Col>
                                </FormGroup>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" md="6">
                        <Card>
                            <CardHeader>
                                <strong>Otros</strong> Características Adicionales
                            </CardHeader>
                            <CardBody>
                                                
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Card>
                    <CardFooter>
                        <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} ><i className="fa fa-dot-circle-o"></i> Guardar</Button>
                    </CardFooter>
                </Card>
            </Form>
        </div>
        )
    }
}
export default Create;