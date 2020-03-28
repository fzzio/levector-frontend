import React, { Component } from 'react';
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
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
            module: (this.props.match.params.module) ? parseInt(this.props.match.params.module) : defines.LVT_CASTING,
            lvtCustomFieldName: '',
            lvtCustomFieldType: 0,
            lvtCustomFieldCategories: [],
            lvtHelpText: '',
            lvtAppendText: '',
            fieldTypes: [],
            categories: [],
            isEnableCustomFieldOptions: false,
            lvtCusmtomFieldOptions: [],
            loading: false,
            error: false,
            redirect: false,
            modalForm: false,
            customFieldId: 0,
            modalVisible: false,
            modal: {
                modalType: '',
                modalTitle: '',
                modalBody: '',
                modalOkButton: '',
                modalCancelButton: '',
                okFunctionState: null,
                cancelFunctionState: this.cancelFunctionState
            }
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.inputTypeHandler = this.inputTypeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.inputCategoryHandler = this.inputCategoryHandler.bind(this);
        this.inputOptionChangeHandler = this.inputOptionChangeHandler.bind(this);
    }

    enableRedirect = () => {
        console.log('OK CLICKED');
        this.setState({ modalVisible: false, redirect: true })
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
            idfieldop:'' ,
            value:'',
            status: defines.STATUS_CREATE_CUSTOM_FIELD_OP
        })
        this.setState({
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions
        });
    }

    inputOptionChangeHandler(e) {
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions        
        let index = lvtCusmtomFieldOptions.findIndex(item => (item.name === e.target.name));
        if (index >= 0) {
            lvtCusmtomFieldOptions[index].value = e.target.value;
        }
        this.setState({
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions,
        });
    }

    isCustomFieldEnabled() {
        let inputType = this.state.lvtCustomFieldType;
        let isEnableCustomFieldOptions = false
        if (
            inputType === defines.CUSTOM_FIELD_CHECKBOX ||
            inputType === defines.CUSTOM_FIELD_COMBOBOX ||
            inputType === defines.CUSTOM_FIELD_RADIO
        ) {
            isEnableCustomFieldOptions = true
        }

        return isEnableCustomFieldOptions;
    }

    inputCategoryHandler(e) {
        let itemValue = parseInt(e.target.value);
        let isChecked = e.target.checked;
        let lvtCustomFieldCategories = this.state.lvtCustomFieldCategories;

        let indexItemValue = lvtCustomFieldCategories.indexOf(parseInt(itemValue));
        if (indexItemValue === -1) {
            // the item does not exist, then if it is checked it is added
            if (isChecked) {
                lvtCustomFieldCategories.push(parseInt(itemValue))
            }
        } else {
            // the item exists, then if it is not checked it is deleted
            if (!isChecked) {
                lvtCustomFieldCategories.splice(indexItemValue, 1);
            }
        }
        lvtCustomFieldCategories.sort()
        this.setState({ lvtCustomFieldCategories: lvtCustomFieldCategories });
    }

    inputTypeHandler(e) {
        let inputType = parseInt(e.target.value)
        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions

        this.setState({
            lvtCustomFieldType: inputType,
            isEnableCustomFieldOptions: this.isCustomFieldEnabled(),
            lvtCusmtomFieldOptions: lvtCusmtomFieldOptions,
        });
    }

    confirmFieldEdited = () => {
        console.log('--- confirm to redirect ----')
        this.setState({
            modalVisible: true,
            loading: false,
            modal: {
                modalType: 'primary',
                modalBody: labels.LVT_MODAL_DEFAULT_EDITION_SUCCESS_TEXT,
                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.enableRedirect
            }
        });
    }

    errorFieldUpdated = (error_message) => {
        this.setState({
            modalVisible: true,
            loading: false,
            modal: {
                modalType: 'danger',
                modalTitle: labels.LVT_MODAL_DEFAULT_ERROR_TITLE,
                modalBody: "No se puede actualizar este campo. " + error_message,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: null
            }
        });
    }

    handleSubmit(event) {

        event.preventDefault();
        console.log(this.state.lvtCusmtomFieldOptions);

        let isEnableCustomFieldOptions = this.isCustomFieldEnabled();
        console.log("enable" + isEnableCustomFieldOptions);

        let customFieldOptions = this.state.lvtCusmtomFieldOptions.filter(function (customFieldOption) {
            if (customFieldOption.name === null || customFieldOption.name === undefined || customFieldOption.name === '') {
                return false; // skip
            }
            if (!isEnableCustomFieldOptions && customFieldOption.status === defines.STATUS_CREATE_CUSTOM_FIELD_OP) {
                return false;
            }
            return true;
        }).map(function (customFieldOption) {
            return {
                id: customFieldOption.status === defines.STATUS_CREATE_CUSTOM_FIELD_OP ? '' : customFieldOption.idfieldop,
                name: customFieldOption.value,
                status: isEnableCustomFieldOptions ? customFieldOption.status : defines.STATUS_DELETE_CUSTOM_FIELD_OP
            }
        });

        console.log("guardar customFieldOptions" + JSON.stringify(customFieldOptions));
        const customFormFieldata = {
            module: this.state.module,
            // idfieldtype: this.state.lvtCustomFieldType,
            name: this.state.lvtCustomFieldName,
            helptext: this.state.lvtHelpText,
            appendtext: this.state.lvtAppendText,
            options: []
        }

        // Get options
        if (customFieldOptions.length) {
            customFormFieldata['options'] = customFieldOptions;
        }

        // Get Categories
        if (this.state.lvtCustomFieldCategories.length) {
            customFormFieldata['categories'] = this.state.lvtCustomFieldCategories;
        }

        console.log("--- customFormFieldata ---");
        console.log(JSON.stringify(customFormFieldata));
        console.log("------");
        this.setState({ loading: true });

        axios.put(
            defines.API_DOMAIN + '/field/update/?id=' + this.state.customFieldId,
            customFormFieldata
        )
            .then((response) => {
                if (response.status === 200) {
                    this.confirmFieldEdited();
                } else if (response.status === 400) {
                    this.errorFieldUpdated(response.data.data.msg)

                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {

                    if (error.response.status === 400) {
                        let msg = '';
                        if (error.response.data.data.mensaje) {
                            msg = error.response.data.data.mensaje;
                            if (error.response.data.data.Opciones && error.response.data.data.Opciones.length) {
                                console.log(error.response.data.data.Opciones)
                                msg = msg + " " + error.response.data.data.Opciones.join(', ')
                            }
                        }
                        if (msg != '')
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

    mapCustomFieldOptions(customOptions) {
        let cumtomOptionsAct = [];
        if ((Array.isArray(customOptions) && customOptions.length)) {
            customOptions.map((itm, itmIdx) =>{
                console.log('mapping: ',itm )
                cumtomOptionsAct.push({
                    idfieldop: itm.idfieldop,
                    value: itm.value,
                    name:'lvtCustomFieldOption_'+itmIdx,
                    status: defines.STATUS_UPDATE_CUSTOM_FIELD_OP
                })
            });
        }
        return cumtomOptionsAct;
    }

    mapCusmtomFieldCategories(customCategories) {
        let cumtomCategoriesAct = [];
        if ((Array.isArray(customCategories) && customCategories.length)) {
            customCategories.map((itm, itmIdx) =>
                cumtomCategoriesAct.push(itm.idcategory)
            );
        }
        return cumtomCategoriesAct;
    }

    componentDidMount() {
        // Get Field Data
        axios.get(defines.API_DOMAIN + '/field?id=' + this.props.match.params.customfieldId + '&module=' + this.state.module)
            .then((response) => {
                if (response.status === 200) {
                    let customfield = response.data.data[0];
                    this.setState({
                        lvtCustomFieldName: customfield.field,
                        lvtCustomFieldType: customfield.idfieldtype,
                        lvtHelpText: customfield.helptext,
                        lvtAppendText: customfield.appendtext,
                        lvtCusmtomFieldOptions: this.mapCustomFieldOptions(customfield.fieldoptions),
                        lvtCustomFieldCategories: this.mapCusmtomFieldCategories(customfield.categories),
                        isEnableCustomFieldOptions: this.isCustomFieldEnabled(),
                        customFieldId: customfield.idfield
                    });
                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error.response.data);
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });

        // Get Field Types
        axios.get(defines.API_DOMAIN + '/fieldtype')
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        fieldTypes: response.data.data,
                    });
                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error.response.data);
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });

        // Get Categories
        axios.get(defines.API_DOMAIN + '/category?module=' + this.state.module)
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        categories: response.data.data,
                    });
                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        console.log(error.response.data.error);
                    } else {
                        console.log(error.response.data);
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });
    }

    handleDelete(customFieldOption, index) {

        let lvtCusmtomFieldOptions = this.state.lvtCusmtomFieldOptions

        if (!(index > 0 && index < lvtCusmtomFieldOptions.length)) {
            return;
        }   
        
        if (customFieldOption.status === defines.STATUS_CREATE_CUSTOM_FIELD_OP) {
            lvtCusmtomFieldOptions = lvtCusmtomFieldOptions.filter(x => x.name !== customFieldOption.name)            
            this.setState({
                lvtCusmtomFieldOptions: lvtCusmtomFieldOptions
            });
            return;
            
        }else{
            lvtCusmtomFieldOptions[index].status = defines.STATUS_DELETE_CUSTOM_FIELD_OP;
            this.setState({
                lvtCusmtomFieldOptions: lvtCusmtomFieldOptions
            })

        }
    }

    render() {
        const fieldTypeList = this.state.fieldTypes;
        const categoryList = this.state.categories;
        const moduleId = this.state.module;
        const isEnableCustomFieldOptions = this.state.isEnableCustomFieldOptions;
        let moduleName = '';
        switch (moduleId) {
            case defines.LVT_CASTING:
                moduleName = labels.LVT_LABEL_PERSON;
                break;

            case defines.LVT_PROPS:
                moduleName = labels.LVT_LABEL_PROPS;
                break;

            case defines.LVT_VESTRY:
                moduleName = labels.LVT_LABEL_VESTRY;
                break;

            case defines.LVT_LOCATIONS:
                moduleName = labels.LVT_LABEL_LOCATIONS;
                break;

            default:
                moduleName = labels.LVT_LABEL_PERSON;
                break;
        }

        if (this.state.redirect) {
            return <Redirect to={`/customfield/${moduleId}/list`} />;
        }

        if (this.state.loading) {
            return (
                <div>
                    <p> Loading... </p>
                </div>
            )
        }
        console.log('this.state.lvtCusmtomFieldOptions:', this.state.lvtCusmtomFieldOptions)
        return (
            <div className="animated fadeIn">

                {
                    (this.state.modalVisible) ?
                        <CustomModal
                            modalType={this.state.modal.modalType}
                            modalTitle={this.state.modal.modalTitle}
                            modalBody={this.state.modal.modalBody}
                            labelOkButton={this.state.modal.modalOkButton}
                            labelCancelButton={this.state.modal.modalCancelButton}
                            okFunction={this.state.modal.okFunctionState}
                            cancelFunction={this.state.modal.cancelFunctionState}
                        />
                        : ''
                }


                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-person" onSubmit={this.handleSubmit} >
                    <Row>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Campo dinámico</strong>  {moduleName}
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
                                                style={{ textTransform: 'capitalize' }}
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
                                    {(categoryList.length > 0) ?
                                        <FormGroup row>
                                            <Col md="3">
                                                <Label htmlFor="lvtCustomCategories">Categorías</Label>
                                            </Col>
                                            <Col xs="12" md="9">
                                                {categoryList.map((category, index) =>
                                                    <FormGroup check className="checkbox" key={index}>
                                                        <Input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={"lvtCategoryOption_" + category.idcategory}
                                                            name="lvtCustomCategories"
                                                            value={parseInt(category.idcategory)}
                                                            style={{ textTransform: 'capitalize' }}
                                                            onChange={(e) => this.inputCategoryHandler.call(this, e)}
                                                            checked={this.state.lvtCustomFieldCategories.indexOf(parseInt(category.idcategory)) > -1 ? true : false}
                                                        />
                                                        <Label check className="form-check-label" htmlFor={`lvtCategoryOption_` + category.idcategory}>
                                                            {category.name.split('||').join(',')}
                                                        </Label>
                                                    </FormGroup>
                                                )}
                                                <FormText color="muted">Categorías del campo.</FormText>
                                            </Col>
                                        </FormGroup>
                                        :
                                        ''
                                    }
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
                            (this.isCustomFieldEnabled()) ?
                                <Col xs="12" md="6">
                                    <Card>
                                        <CardHeader>
                                            <strong>Opciones</strong> a agregar
                                        </CardHeader>
                                        <CardBody>
                                            {this.state.lvtCusmtomFieldOptions.map((customFieldOption, indexOption) =>
                                                (customFieldOption.status !== defines.STATUS_DELETE_CUSTOM_FIELD_OP) ?

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
                                                                value={customFieldOption.value ? customFieldOption.value.split('||').join(',') : ''}
                                                                onChange={(e) => this.inputOptionChangeHandler.call(this, e, customFieldOption)}
                                                            />
                                                        </Col>
                                                        <Col md="2">
                                                            <Button outline color="dark" size="sm" className="ml-1" onClick={() => this.handleDelete(customFieldOption, indexOption)}>
                                                                <i className="fa fa-trash"></i>
                                                            </Button>
                                                        </Col>
                                                    </FormGroup>
                                                    : ''
                                            )}
                                        </CardBody>
                                        <CardFooter>
                                            <Button size="sm" color="primary" onClick={() => this.appendInput()} >
                                                <i className="fa fa-plus-circle"></i> Añadir
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </Col>
                                : ''
                        }
                    </Row>
                    <Card>
                        <CardFooter>
                            <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} ><i className="fa fa-dot-circle-o"></i> Guardar</Button>
                            {/* <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Limpiar</Button> */}
                            {' '}
                            <Link to={`/customfield/${moduleId}/list`} size="sm" className="btn btn-secondary btn-sm" color="link">Cancelar</Link>
                        </CardFooter>
                    </Card>
                </Form>
            </div>
        );
    }
}

export default Edit;
