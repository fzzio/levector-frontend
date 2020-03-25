import React, { Component, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Table,
    Row,
} from 'reactstrap';
import { AppSwitch } from '@coreui/react'
import axios from 'axios';
import defines from '../../defines'
import labels from '../../labels';
import CustomModal from '../Notifications/Modals/CustomModal';

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            module: (this.props.match.params.module) ? parseInt(this.props.match.params.module) : defines.LVT_CASTING,
            customFields: [],
            limit: 8,
            offset: 0,
            loading: true,
            error: false,
            errorCode: 0,
            errorMessage: '',
            idtodelete: '',
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
    }

    componentDidMount() {
        // fetch all API data
        const requestCustomFields = axios.get(defines.API_DOMAIN + '/field?allstatus=1&module=' + this.state.module);
        axios.all([requestCustomFields])
            .then(axios.spread((...responses) => {
                const responseCustomFields = responses[0];

                if (responseCustomFields.status === 200) {
                    this.setState({
                        error: false,
                        customFields: responseCustomFields.data.data,
                    });
                } else {
                    throw new Error(JSON.stringify({ status: responseCustomFields.status, error: responseCustomFields.data.data.msg }));
                }
            }))
            .catch((error) => {
                if (error.response) {
                    if (error.response.data.data) {
                        this.setState({
                            error: true,
                            errorCode: error.response.status,
                            errorMessage: error.response.data.data.msg
                        });
                        console.log(this.state.errorMessage);
                    } else {
                        console.log(error.response);
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });
    }

    handleDelete(idfield) {
        this.setState({
            modalVisible: true,
            idtodelete: idfield,
            modal: {
                modalType: 'danger',
                modalBody: 'Esta seguro de eliminar a registro?',
                modalTitle: labels.LVT_MODAL_DEFAULT_CONFIRMATION_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                modalCancelButton: labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
                okFunctionState: this.deletCall,
                cancelFunctionState: this.cancelFunctionState
            }
        });
    }

    statusSwitch = (e) => {
        this.setState({ modalVisible: false });
        let idfield = e.target.dataset.idfield;
        let ischecked = e.target.checked;

        console.log('----switch id: ', idfield)
        console.log('----switch id: ', ischecked)

        axios.put(defines.API_DOMAIN + '/field/updatestatus?status=' + defines.LVT_STATUS_INACTIVE + '&module=' + this.state.module + '&id=' + idfield)
            .then((response) => {
                if (response.status === 200) {
                    console.log('--- confirm deleted ----')
                    console.log(response.data.data);
                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        this.setState({
                            modalVisible: true,
                            loading: false,
                            modal: {
                                modalType: 'warning',
                                modalBody: error.response.data.error,
                                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                                okFunctionState: this.okFunction
                            }
                        });
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

    cancelFunctionState = () => {
        this.setState({ modalVisible: false })
    }


    deletCall = () => {
        let that = this;
        this.setState({ modalVisible: false });

        const deleteFieldRequest = axios.put(defines.API_DOMAIN + '/field/updatestatus?status=' + defines.LVT_STATUS_REMOVED + '&module=' + this.state.module + '&id=' + this.state.idtodelete);

        axios.all([deleteFieldRequest])
            .then(axios.spread((...responses) => {
                const resp = responses[0];

                if (resp.status === 200) {
                    console.log('=== data:', resp.data)
                    this.confirmDeletedField(resp.data.data.status || defines.LVT_STATUS_REMOVED);
                    if (resp.data.data.status === defines.LVT_STATUS_REMOVED) {
                        this.setState({
                            customFields: this.state.customFields.filter(customField => parseInt(customField.idfield) !== parseInt(that.state.idtodelete))
                        })
                    } else {
                        let temp_fields = this.state.customFields;

                        temp_fields.map((field) => {
                            if (field.idfield === that.state.idtodelete) {
                                field.status = resp.data.data.status;
                            }
                        })
                        console.log('=== ', temp_fields)
                        this.setState({ customFields: temp_fields })
                    }

                } else {
                    throw new Error(JSON.stringify({ status: resp.status, error: resp.data.data.msg }));
                }
            }))
            .catch((error) => {
                if (error.response) {
                    this.setState({
                        error: true,
                        errorCode: error.response.status,
                        errorMessage: error.response.data.data.msg,
                    });
                    console.log(this.state);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });

    }

    confirmDeletedField = (deleted_status) => {
        console.log('--- confirm deleted ----')
        this.setState({
            modalVisible: true,
            loading: false,
            modal: {
                modalType: deleted_status == 2 ? 'warning' : 'primary',
                modalBody: deleted_status == 2 ? 'Este campo no puede eliminarse porque esta siendo usado. Su estado ha cambiado a deshabilitado.' : labels.LVT_MODAL_DEFAULT_DELETION_SUCCESS_TEXT,
                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.okFunction
            }
        });
    }

    okFunction = () => {
        this.setState({ modalVisible: false })
    }

    render() {
        const customFieldList = this.state.customFields;
        const moduleId = this.state.module;
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
        console.log('---- customFieldList: ', customFieldList)
        if (this.state.error) {
            return (
                <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <p>
                                        {this.state.errorMessage}
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
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
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-align-justify"></i> Dinámicos <small className="text-muted">Campos personalizados para {moduleName}</small>
                            </CardHeader>
                            <CardBody>
                                <Table responsive hover bordered>
                                    <thead>
                                        <tr>
                                            <th scope="col">No.</th>
                                            <th scope="col">Nombre</th>
                                            <th scope="col">Tipo</th>
                                            <th scope="col">Ayuda</th>
                                            <th scope="col">Unidades</th>
                                            <th scope="col">Items</th>
                                            <th scope="col">Categorías</th>
                                            <th scope="col">Acciones</th>
                                            <th scope="col">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            (customFieldList.length) ?
                                                customFieldList.map((customField, index) =>
                                                    <tr key={index}>
                                                        <th>{index + 1}</th>
                                                        <td>{customField.field}</td>
                                                        <td className="text-center">
                                                            {
                                                                (customField.idfieldtype === defines.CUSTOM_FIELD_TEXT) ?
                                                                    <i className="fa fa-font fa-lg mt-2"></i>
                                                                    : (customField.idfieldtype === defines.CUSTOM_FIELD_TEXTAREA) ?
                                                                        <i className="fa fa-align-justify fa-lg mt-2"></i>
                                                                        : (customField.idfieldtype === defines.CUSTOM_FIELD_CHECKBOX) ?
                                                                            <i className="fa fa-check-square-o fa-lg mt-2"></i>
                                                                            : (customField.idfieldtype === defines.CUSTOM_FIELD_RADIO) ?
                                                                                <i className="fa fa-dot-circle-o fa-lg mt-2"></i>
                                                                                : (customField.idfieldtype === defines.CUSTOM_FIELD_COMBOBOX) ?
                                                                                    <i className="fa fa-chevron-down fa-lg mt-2"></i>
                                                                                    : ''
                                                            }
                                                            <br />
                                                            <span color="muted">({customField.type})</span>
                                                        </td>
                                                        <td>{customField.helptext}</td>
                                                        <td>{customField.appendtext}</td>
                                                        <td>
                                                            {
                                                                (customField.fieldoptions.length) ?
                                                                    <ul>
                                                                        {customField.fieldoptions.map((customFieldItem, indexItem) =>
                                                                            <li key={indexItem}>
                                                                                {customFieldItem.value.split('||').join(',')}
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                    : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                (customField.categories) ?
                                                                    <ul>
                                                                        {customField.categories.map((customFieldCategory, indexCategory) =>
                                                                            <li key={indexCategory}>
                                                                                {customFieldCategory.value.split('||').join(',')}
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                    : ''
                                                            }
                                                        </td>
                                                        <td>
                                                            {customField.idstatus === 1 &&
                                                                <React.Fragment>
                                                                    <Link to={`/customfield/${moduleId}/${customField.idfield}/edit`} outline="true" className="btn btn-dark btn-sm" size="sm">
                                                                        <i className="fa fa-edit"></i>
                                                                    </Link>
                                                                    <Button outline color="dark" size="sm" className="ml-1" onClick={() => this.handleDelete(customField.idfield)}>
                                                                        <i className="fa fa-trash"></i>
                                                                    </Button>
                                                                </React.Fragment>
                                                            }
                                                        </td>
                                                        <td>
                                                            <AppSwitch className={'mx-1'} color={'dark'} checked={customField.idstatus === defines.LVT_STATUS_INACTIVE ? false : true} data-idfield={customField.idfield} onChange={this.statusSwitch} />
                                                        </td>
                                                    </tr>
                                                )
                                                : ''
                                        }
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )

    }
}
export default List;