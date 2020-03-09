import React, { Component } from 'react';
import axios from 'axios';
import defines from '../../defines'
import labels from '../../labels';

import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import CustomModal from '../Notifications/Modals/CustomModal';

class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible : false,
            fields:{
                fname:'',
                utype:1,
                ftype: 1,
                fhelp: 0,
                fshort: 0,
            },
            fieldTypes:[],
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

    inputChangeHandler = (e) =>{
        let temp_fields = this.state.fields;
        temp_fields[e.target.id] = e.target.value;
        this.setState( { fields:temp_fields } )
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    componentDidMount() {
        // fetch all API data
        const requestFieldTypes = axios.get( defines.API_DOMAIN + '/fieldtype' );
        axios.all([requestFieldTypes]).then(axios.spread((...responses) => {
            const respTypes = responses[0];
            if(respTypes.status === 200 ) {
                this.setState({ 
                    fieldTypes: respTypes.data.data,
                });
            }else{
                throw new Error( JSON.stringify( {status: respTypes.status, error: respTypes.data.data.msg} ) );
            }
        }))
        .catch( (error) => {
            if (error.response) { 
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        });
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
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-person" onSubmit={this.handleSubmit} >
                    <Row>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Campo dinámico</strong> Información
                                </CardHeader>
                                <CardBody>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="fname">Nombre</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id="fname"
                                                name="fname"
                                                placeholder=""
                                                autoComplete="off"
                                                value={this.state.fname}
                                                onChange={ this.inputChangeHandler}
                                            />
                                            <FormText color="muted">Nombre del campo dinámico</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="utype">Tipo de Utilería</Label>
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
                                            <Label htmlFor="ftype">Tipo</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input 
                                                type="select" 
                                                name="ftype" 
                                                id="ftype" 
                                                style={{ textTransform: 'capitalize'}}
                                                onChange={(e) => this.inputTypeHandler.call(this, e)}
                                            >
                                                <option value="0">-- Seleccione --</option>
                                                {this.state.fieldTypes.map((type, i) =>
                                                    <option key={i} value={type.idfieldtype}>
                                                        {type.name}
                                                    </option>
                                                )}
                                            </Input>
                                            <FormText color="muted">Tipo de campo</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="uhelp">Texto de ayuda</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id="uhelp"
                                                name="uhelp"
                                                placeholder=""
                                                autoComplete="off"
                                                value={this.state.uhelp}
                                                onChange={this.inputChangeHandler}
                                            />
                                            <FormText color="muted">Ingrese texto de ayuda para mostrar</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="fshort">Abreviatura</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id="fshort"
                                                name="fshort"
                                                placeholder=""
                                                autoComplete="off"
                                                value={this.state.fshort}
                                                onChange={this.inputChangeHandler}
                                            />
                                            <FormText color="muted">Ingrese unidades (cm, kg, etc) en caso de ser necesario</FormText>
                                        </Col>
                                    </FormGroup>
                                </CardBody>
                                <CardFooter>
                                    <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} ><i className="fa fa-dot-circle-o"></i> Guardar</Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </Form> 
            </div>
        )
    }
}
export default Create;