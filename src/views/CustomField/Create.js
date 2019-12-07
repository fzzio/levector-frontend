import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
import defines from '../../defines'
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    Container,
    DropdownItem, DropdownMenu, DropdownToggle,
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
    Modal, ModalBody, ModalFooter, ModalHeader,
    Row,
} from 'reactstrap';

class Create extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            lvtCustomFieldName: '',
            lvtCustomFieldType: '',
            fieldTypes: [],
            isEnableCustomFieldOptions: false,
            lvtCusmtomFieldOptionsNames: [],
            lvtCusmtomFieldOptionsData: [],
            loading: false,
            error: false,
            redirect: false,
            modalForm: false,
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.inputTypeHandler = this.inputTypeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    inputChangeHandler(e) {
        let state = this.state;
        state[e.target.name] = e.target.value;
        this.setState({ state });
    }

    inputTypeHandler(e) {
        let inputType = parseInt(e.target.value)
        let isEnableCustomFieldOptions = false
        if( 
            inputType === defines.CUSTOM_FIELD_CHECKBOX ||  
            inputType === defines.CUSTOM_FIELD_COMBOBOX ||  
            inputType === defines.CUSTOM_FIELD_RADIO 
        ){
            isEnableCustomFieldOptions = true
        }else{
            isEnableCustomFieldOptions = false
        }
        this.setState({
            lvtCustomFieldType: inputType,
            isEnableCustomFieldOptions: isEnableCustomFieldOptions,
        });
    }
    
    handleSubmit(event){
        event.preventDefault();
        console.log(this.state)
    }
    
    componentDidMount() {
        // fetch all API data
        const requestFieldTypes = axios.get( defines.API_DOMAIN + '/fieldtype' );
        axios.all([requestFieldTypes]).then(axios.spread((...responses) => {
            const responseFieldTypes = responses[0];
            if(responseFieldTypes.status === 200 ) {
                this.setState({ 
                    fieldTypes: responseFieldTypes.data.data,
                });
            }else{
                throw new Error( JSON.stringify( {status: responseFieldTypes.status, error: responseFieldTypes.data.data.msg} ) );
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

    appendInput() {
        var newInput = `lvtCustomFieldOption_${this.state.lvtCusmtomFieldOptionsNames.length}`;
        this.setState(prevState => ({ lvtCusmtomFieldOptionsNames: prevState.lvtCusmtomFieldOptionsNames.concat([newInput]) }));
    }

    render() {
        const fieldTypeList = this.state.fieldTypes;
        const isEnableCustomFieldOptions = this.state.isEnableCustomFieldOptions;
        return (
            <div className="animated fadeIn">
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
                                            <Label htmlFor="lvtCustomFieldName">Nombre</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id="lvtCustomFieldName"
                                                name="lvtCustomFieldName"
                                                placeholder=""
                                                value={this.state.lvtCustomFieldName}
                                                onChange={(e) => this.inputChangeHandler.call(this, e)}
                                            />
                                            <FormText color="muted">Nombre del campo dinámico</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="lvtCustomFieldType">Tipo</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input 
                                                type="select" 
                                                name="lvtCustomFieldType" 
                                                id="lvtCustomFieldType" 
                                                style={{ textTransform: 'capitalize'}}
                                                onChange={(e) => this.inputTypeHandler.call(this, e)}
                                            >
                                                <option value="0">-- Seleccione --</option>
                                                {fieldTypeList.map((fieldType, indexItem) =>
                                                    <option key={indexItem} value={fieldType.idfieldtype}>
                                                        {fieldType.name}
                                                    </option>
                                                )}
                                            </Input>
                                            <FormText color="muted">Tipo de campo</FormText>
                                        </Col>
                                    </FormGroup>
                                </CardBody>
                            </Card>
                        </Col>
                        {
                            ( isEnableCustomFieldOptions ) ?
                                <Col xs="12" md="6">
                                    <Card>
                                        <CardHeader>
                                            <strong>Opciones</strong> a agregar
                                        </CardHeader>
                                        <CardBody>
                                            {this.state.lvtCusmtomFieldOptionsNames.map((customFieldOption, indexOption) => 
                                                <FormGroup row key={indexOption}>
                                                    <Col md="3">
                                                        {/* <Label htmlFor={`${customFieldOption}`}>Opción 1</Label> */}
                                                        <Label htmlFor={customFieldOption}>Opción {indexOption + 1}</Label>
                                                    </Col>
                                                    <Col xs="12" md="9">
                                                        <Input
                                                            type="text"
                                                            id={customFieldOption}
                                                            name={customFieldOption}
                                                            placeholder={'Item ' + (indexOption + 1)}
                                                        />
                                                    </Col>
                                                </FormGroup>
                                            )}
                                        </CardBody>
                                        <CardFooter>
                                            <Button size="sm" color="primary" onClick={ () => this.appendInput() } >
                                                <i className="fa fa-plus-circle"></i> Añadir
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Col>
                            :   ''
                        }
                    </Row>
                    <Card>
                        <CardFooter>
                            <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} ><i className="fa fa-dot-circle-o"></i> Guardar</Button>
                            {/* <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Limpiar</Button> */}
                        </CardFooter>
                    </Card>
                </Form>
            </div>
        );
    }
}

export default Create;
