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

class Edit extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            lvtCustomFieldName: '',
            lvtCustomFieldType: '0',
            lvtHelpText: '',
            lvtAppendText: '',
            fieldTypes: [],
            isEnableCustomFieldOptions: false,
            lvtCusmtomFieldOptions: [],
            loading: false,
            error: false,
            redirect: false,
            modalForm: false,
            customField:{}
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

    appendInput() {
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
        lvtCusmtomFieldOptions.push({
            name: `lvtCustomFieldOption_${this.state.lvtCusmtomFieldOptions.length}`,
            value: ''
        })
        this.setState({
            lvtCusmtomFieldOptions : lvtCusmtomFieldOptions
        });
    }

    inputOptionChangeHandler(e) {
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
        let index = lvtCusmtomFieldOptions.findIndex(item => (item.name === e.target.name));
        if( index >= 0 ){
            lvtCusmtomFieldOptions[index].value = e.target.value;
        }
        this.setState({
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions,
        });
    }

    inputTypeHandler(e) {
        let inputType = parseInt(e.target.value)
        let isEnableCustomFieldOptions = false
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
        if( 
            inputType === defines.CUSTOM_FIELD_CHECKBOX ||  
            inputType === defines.CUSTOM_FIELD_COMBOBOX ||  
            inputType === defines.CUSTOM_FIELD_RADIO 
        ){
            isEnableCustomFieldOptions = true
        }else{
            isEnableCustomFieldOptions = false
            lvtCusmtomFieldOptions = []
        }
        this.setState({
            lvtCustomFieldType: inputType,
            isEnableCustomFieldOptions: isEnableCustomFieldOptions,
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions,
        });
    }
    
    handleSubmit(event){
        event.preventDefault();
        let customFieldOptions = this.state.lvtCusmtomFieldOptions.filter(function(customFieldOption) {
            if( customFieldOption.value === null || customFieldOption.value === undefined || customFieldOption.value === '' ){
              return false; // skip
            }
            return true;
        }).map(function(customFieldOption) {
            return {
              name: customFieldOption.value,
            }
        });
        const customFormFieldata = {
            idfieldtype: this.state.lvtCustomFieldType,
            name: this.state.lvtCustomFieldName,
            helptext: this.state.lvtHelpText,
            appendtext: this.state.lvtAppendText,
        }
        if( customFieldOptions.length ){
            customFormFieldata['options'] = customFieldOptions
        }
    
        console.log(customFormFieldata)
        this.setState({ loading: true });
        axios.post(
            defines.API_DOMAIN + '/fieldcastp/', 
            customFormFieldata
        )
        .then( (response) => {
            if(response.status === 200 ) {
                this.setState({ loading: false, redirect: true });
            }else{
                throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
            }
        }).catch( (error) => {
            if (error.response) { 
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            this.setState({ loading: false, error: true });
        });
    }
    
    componentDidMount() {
        //obtain customField
        const requestCustomField = axios.get( defines.API_DOMAIN + '/fieldcastp/' + this.props.match.params.customfieldId);
        axios.all([requestCustomField]).then(axios.spread((...responses) => {
            const responseCustomField = responses[0];
            if(responseCustomField.status === 200 ) {             
                if ((Array.isArray(responseCustomField.data.data) && responseCustomField.data.data.length))
                {
                    let customfield = responseCustomField.data.data[0];
                    this.setState({ 
                        lvtCustomFieldName: customfield.name,
                        lvtCustomFieldType: customfield.idfieldtype,
                        lvtHelpText: customfield.helptext,
                        lvtAppendText: customfield.appendtext
                    });
                }                   
            }else{
                throw new Error( JSON.stringify( {status: responseCustomField.status, error: responseCustomField.data.data.msg} ) );
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

    render() {
        const fieldTypeList = this.state.fieldTypes;
        const isEnableCustomFieldOptions = this.state.isEnableCustomFieldOptions;
        if (this.state.redirect) {
            return <Redirect to='/customfield/list'/>;
        }
        if (this.state.loading) {
            return(
                <div>
                    <p> Loading... </p>
                </div>
            )
        }
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
                                            <Input type="select" value={this.state.lvtCustomFieldType}
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
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="lvtHelpText">Texto de ayuda</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id="lvtHelpText"
                                                name="lvtHelpText"
                                                placeholder=""
                                                value={this.state.lvtHelpText}
                                                onChange={(e) => this.inputChangeHandler.call(this, e)}
                                            />
                                            <FormText color="muted">Ingrese texto de ayuda para mostrar</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="lvtAppendText">Abreviatura</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input
                                                type="text"
                                                id="lvtAppendText"
                                                name="lvtAppendText"
                                                placeholder=""
                                                value={this.state.lvtAppendText}
                                                onChange={(e) => this.inputChangeHandler.call(this, e)}
                                            />
                                            <FormText color="muted">Ingrese unidades (cm, kg, etc) en caso de ser necesario</FormText>
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
                                            {this.state.lvtCusmtomFieldOptions.map((customFieldOption, indexOption) => 
                                                <FormGroup row key={indexOption}>
                                                    <Col md="3">
                                                        <Label htmlFor={customFieldOption.name}>Opción {indexOption + 1}</Label>
                                                    </Col>
                                                    <Col xs="12" md="9">
                                                        <Input
                                                            type="text"
                                                            id={customFieldOption.name}
                                                            name={customFieldOption.name}
                                                            placeholder={'Item ' + (indexOption + 1)}
                                                            value={customFieldOption.value}
                                                            onChange={(e) => this.inputOptionChangeHandler.call(this, e)}
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

export default Edit;
