import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
import defines from '../../defines';
import labels from '../../labels';
import CustomModal from '../Notifications/Modals/CustomModal';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Form,
    FormGroup,
    FormText,
    Input,
    Label,
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
            customFieldId:0,
            modalVisible:false,
            modal:{
                modalType:'',
                modalTitle:'',
                modalBody:'',
                modalOkButton:'',
                modalCancelButton:'',
                okFunctionState:null,
                cancelFunctionState: this.cancelFunctionState
            }
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.inputTypeHandler = this.inputTypeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.inputOptionChangeHandler = this.inputOptionChangeHandler.bind(this);       
    }

    enableRedirect=()=>{
        console.log('OK CLICKED');
        this.setState({modalVisible:false, redirect: true})
    }

    inputChangeHandler(e) {
        let state = this.state;
        state[e.target.name] = e.target.value;
        this.setState({ state });
    }

    appendInput() {
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
        lvtCusmtomFieldOptions.push({
            name: '',
            idfieldopcastp: `lvtCustomFieldOption_${this.state.lvtCusmtomFieldOptions.length}`,
            status: defines.STATUS_CREATE_CUSTOM_FIELD_OP
        })
        this.setState({
            lvtCusmtomFieldOptions : lvtCusmtomFieldOptions
        });
    }

    inputOptionChangeHandler(e, itm) {
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
        
        let index = lvtCusmtomFieldOptions.findIndex(item => (item.idfieldopcastp === itm.idfieldopcastp));

        if( index >= 0 ){
            lvtCusmtomFieldOptions[index].name = e.target.value;
        }
        this.setState({
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions,
        });
    }

    isCumtonFilesEnabled()
    {
        let inputType = this.state.lvtCustomFieldType;
        let isEnableCustomFieldOptions = false
        if( 
            inputType === defines.CUSTOM_FIELD_CHECKBOX ||  
            inputType === defines.CUSTOM_FIELD_COMBOBOX ||  
            inputType === defines.CUSTOM_FIELD_RADIO 
        ){
            isEnableCustomFieldOptions = true
        }

        return isEnableCustomFieldOptions;
    }

    inputTypeHandler(e) {
        let inputType = parseInt(e.target.value)
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
        
        this.setState({
            lvtCustomFieldType: inputType,
            isEnableCustomFieldOptions: this.isCumtonFilesEnabled(),
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions,
        });
    }
    
    confirmFieldEdited = () =>{
        console.log('--- confirm to redirect ----')
        this.setState({
            modalVisible:true,
            loading: false,
            modal:{
                modalType : 'primary',
                modalBody : labels.LVT_MODAL_DEFAULT_EDITION_SUCCESS_TEXT,
                modalTitle : labels.LVT_MODAL_DEFAULT_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.enableRedirect
            }
        });
    }

    errorFieldUpdated = (error_message) => {
        this.setState({
            modalVisible:true,
            loading: false,
            modal:{
                modalType : 'danger',                
                modalTitle : labels.LVT_MODAL_DEFAULT_ERROR_TITLE,
                modalBody : "No se puede actualizar este campo. "+error_message,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: null
            }
        });
    }

    handleSubmit(event){

        event.preventDefault();
        console.log(this.state.lvtCusmtomFieldOptions);

        let isEnableCustomFieldOptions=this.isCumtonFilesEnabled();
        console.log("enable"+isEnableCustomFieldOptions);

        let customFieldOptions = this.state.lvtCusmtomFieldOptions.filter(function(customFieldOption) {
            if( customFieldOption.name === null || customFieldOption.name === undefined || customFieldOption.name === '' ){
              return false; // skip
            }
            if (!isEnableCustomFieldOptions && customFieldOption.status === defines.STATUS_CREATE_CUSTOM_FIELD_OP)
            {
                return false;
            }
            return true;
        }).map(function(customFieldOption) {
            return {
                idfieldopcast: customFieldOption.status === defines.STATUS_CREATE_CUSTOM_FIELD_OP ? '' : customFieldOption.idfieldopcastp,
                name:customFieldOption.name,
                status:  isEnableCustomFieldOptions ? customFieldOption.status : defines.STATUS_DELETE_CUSTOM_FIELD_OP
              }
        });

        console.log("guardar customFieldOptions" + JSON.stringify(customFieldOptions));
        const customFormFieldata = {
            // idfieldtype: this.state.lvtCustomFieldType,
            name: this.state.lvtCustomFieldName,
            helptext: this.state.lvtHelpText,
            appendtext: this.state.lvtAppendText,
            options: []
        }
        if( customFieldOptions.length ){
            customFormFieldata['options'] = customFieldOptions
        }
    
        console.log(customFormFieldata)

        this.setState({ loading: true });

        axios.put(
            defines.API_DOMAIN + '/fieldcastp/' + this.state.customFieldId, 
            customFormFieldata
        )
        .then( (response) => {

            if(response.status === 200 ) {
                this.confirmFieldEdited();
            } else if( response.status === 400 ){
                this.errorFieldUpdated(response.data.data.msg)

            } else{
                throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
            }
        }).catch( (error) => {
            if (error.response) { 

                if(error.response.status === 400){
                    let msg = '';
                    if(error.response.data.data.mensaje){
                        msg = error.response.data.data.mensaje;
                        if( error.response.data.data.Opciones && error.response.data.data.Opciones.length ){
                            console.log(error.response.data.data.Opciones)
                            msg = msg + " "+ error.response.data.data.Opciones.join(', ')
                        }
                    }
                    if(msg!='')
                        this.errorFieldUpdated(msg)
                    else
                        this.errorFieldUpdated(labels.LVT_MODAL_DEFAULT_ERROR_MESSAGE)
                }
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
            this.setState({ loading: false, error: true });
        });
    }
    
    mapCusmtomFieldOptions(customOptions)
    {
        let cumtomOptionsAct = [];
        if ((Array.isArray(customOptions) && customOptions.length))
        {
            customOptions.map((itm, itmIdx) =>
                cumtomOptionsAct.push({
                    idfieldopcastp: itm.idfieldopcastp,
                    name: itm.value,
                    status: defines.STATUS_UPDATE_CUSTOM_FIELD_OP
                    })
                );
        }

        return cumtomOptionsAct;        
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
                        lvtCustomFieldName: customfield.fieldoption,
                        lvtCustomFieldType: customfield.idfieldtype,
                        lvtHelpText: customfield.helptext,
                        lvtAppendText: customfield.appendtext,
                        lvtCusmtomFieldOptions: this.mapCusmtomFieldOptions(customfield.values),
                        isEnableCustomFieldOptions : this.isCumtonFilesEnabled(),
                        customFieldId: customfield.idfieldcastp
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

    handleDelete(customFieldOption, index){
        
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions
       
        if (!(index > 0 && index < lvtCusmtomFieldOptions.length))
        {
            return;
        }
       
        if (customFieldOption.status === defines.STATUS_CREATE_CUSTOM_FIELD_OP)
        {
            lvtCusmtomFieldOptions = lvtCusmtomFieldOptions.filter(x => x.idfieldopcastp !== customFieldOption.idfieldopcastp)            
            this.setState({
                lvtCusmtomFieldOptions: lvtCusmtomFieldOptions
            });
            return;
        }
        
        lvtCusmtomFieldOptions[index].status = defines.STATUS_DELETE_CUSTOM_FIELD_OP;
        this.setState({
           lvtCusmtomFieldOptions: lvtCusmtomFieldOptions
        })        
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

                { 
                    (this.state.modalVisible) ?
                        <CustomModal
                            modalType = {this.state.modal.modalType}
                            modalTitle = {this.state.modal.modalTitle}
                            modalBody = {this.state.modal.modalBody}
                            labelOkButton = {this.state.modal.modalOkButton}
                            labelCancelButton = {this.state.modal.modalCancelButton}
                            okFunction = {this.state.modal.okFunctionState}
                            cancelFunction = {this.state.modal.cancelFunctionState}
                        />
                    : ''
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
                            ( this.isCumtonFilesEnabled() ) ?
                                <Col xs="12" md="6">
                                    <Card>
                                        <CardHeader>
                                            <strong>Opciones</strong> a agregar
                                        </CardHeader>
                                        <CardBody>
                                            {this.state.lvtCusmtomFieldOptions.map((customFieldOption, indexOption) => 
                                                (customFieldOption.status !== defines.STATUS_DELETE_CUSTOM_FIELD_OP)?
                                                
                                                <FormGroup row key={indexOption}>
                                                    <Col md="3">
                                                        <Label htmlFor={`lvtCustomFieldOption_${indexOption}`}>Opción {indexOption + 1}</Label>
                                                    </Col>
                                                    <Col xs="12" md="7">
                                                        <Input
                                                            type="text"
                                                            id={`lvtCustomFieldOption_${indexOption}`} 
                                                            name={`lvtCustomFieldOption_${indexOption}`}
                                                            placeholder={'Item ' + (indexOption + 1)}
                                                            autoComplete="off"
                                                            value={customFieldOption.name}
                                                            onChange={(e) => this.inputOptionChangeHandler.call(this, e, customFieldOption)}
                                                        />
                                                    </Col>
                                                    <Col md="2">
                                                        <Button outline color="dark" size="sm" className="ml-1" onClick={() => this.handleDelete(customFieldOption, indexOption)}>
                                                            <i className="fa fa-trash"></i>
                                                        </Button>
                                                    </Col>
                                                </FormGroup>
                                                :''
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
