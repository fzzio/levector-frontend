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
            customFields: [],
            limit: 8,
            offset: 0,
            loading: true,
            error: false,
            errorCode: 0,
            errorMessage: '',
            idtodelete:'',
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
    }

    componentDidMount() {
        // fetch all API data
        const requestCustomFields = axios.get( defines.API_DOMAIN + '/allfieldcastopp' );
        axios.all([requestCustomFields]).then(axios.spread((...responses) => {
            const responseCustomFields = responses[0];
        
            if(responseCustomFields.status === 200 ) {
                this.setState({ 
                    error: false,
                    customFields: responseCustomFields.data.data,
                });
            }else{
                throw new Error( JSON.stringify( {status: responseCustomFields.status, error: responseCustomFields.data.data.msg} ) );
            }
        }))
        .catch( (error) => {
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

    handleDelete(idfieldcastp){
        // TODO @fzzio call api to delete
        this.setState({
            modalVisible:true,
            idtodelete:idfieldcastp,
            modal:{
                modalType : 'danger',
                modalBody : 'Esta seguro de eliminar a registro?',
                modalTitle : labels.LVT_MODAL_DEFAULT_CONFIRMATION_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                modalCancelButton: labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
                okFunctionState: this.deletCall,
                cancelFunctionState: this.cancelFunctionState
            }
        });
    }

    
    deletCall = () =>{
        let that  = this;
        this.setState({
            customFields: this.state.customFields.filter(customField => parseInt(customField.idfieldcastp) !== parseInt(that.state.idtodelete))
        })
    }

    render() {
        const customFieldList = this.state.customFields;
        if (this.state.error) {
            return(
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
              <Row>
                <Col xl={12}>
                    <Card>
                        <CardHeader>
                            <i className="fa fa-align-justify"></i> Dinámicos <small className="text-muted">Campos personalizados para el usuario</small>
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
                                        <th scope="col">Acciones</th>
                                        <th scope="col">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        ( customFieldList.length ) ?
                                            customFieldList.map((customField, index) =>
                                                <tr key={index}>
                                                    <th>{index + 1}</th>
                                                    <td>{customField.fieldoption}</td>
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
                                                            ( customField.values.length ) ?
                                                                <ul>
                                                                    {customField.values.map((customFieldItem, indexItem) =>
                                                                        <li key={indexItem}>
                                                                            {customFieldItem.value.split('||').join(',')}
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            :   ''
                                                        }
                                                    </td>
                                                    <td>
                                                        <Link to={`/customfield/${customField.idfieldcastp}/edit`} outline className="btn btn-dark btn-sm" size="sm">
                                                            <i className="fa fa-edit"></i>
                                                        </Link>
                                                        
                                                        <Button outline color="dark" size="sm" className="ml-1" onClick={() => this.handleDelete(customField.idfieldcastp)}>
                                                            <i className="fa fa-trash"></i>
                                                        </Button>
                                    
                                                    </td>
                                                    <td>
                                                        <AppSwitch className={'mx-1'} color={'dark'} checked />
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