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

const TEMP_UTILITY_LIST = [
    {
        "idfieldcastp": 1,
        "idfieldtype": 1,
        "idfieldcategory": 2,
        "type": "Text",
        "fieldoption": "Marca",
        "helptext": "Marca de la prenda",
        "appendtext": "",
        "status": 1,
        "values": []
    }, {
        "idfieldcastp": 2,
        "idfieldtype": 1,
        "idfieldcategory": 2,
        "type": "Text",
        "fieldoption": "Talla",
        "helptext": "Talla de la prenda de vestir ",
        "appendtext": "",
        "status": 1,
        "values": []
    }, {
        "idfieldcastp": 3,
        "idfieldtype": 3,
        "idfieldcategory": 1,
        "type": "Combo Box",
        "fieldoption": "Ambiente",
        "helptext": "Ambiente del lugar",
        "appendtext": "",
        "status": 1,
        "values": [{
            "idfieldopcastp": 1,
            "value": "Sala"
        }, {
            "idfieldopcastp": 2,
            "value": "Comedor"
        }, {
            "idfieldopcastp": 3,
            "value": "Cocina"
        }, {
            "idfieldopcastp": 4,
            "value": "Patio"
        }]
    }
];

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

    componentWillMount() {
        localStorage.setItem("custompropsfields", JSON.stringify(TEMP_UTILITY_LIST));
    }
    componentDidMount() {
        // fetch all API data
        // const requestCustomFields = axios.get( defines.API_DOMAIN + '/allfieldcastopp' );
        {/*
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
        */}
    }

    handleDelete(idfieldcastp){
        // TODO @fzzio call api to delete
        this.setState({
            modalVisible:true,
            idtodelete:idfieldcastp,
            modal:{
                modalType : 'danger',
                modalBody : labels.LVT_WARNING_ELIMINAR_REGISTRO,
                modalTitle : labels.LVT_MODAL_DEFAULT_CONFIRMATION_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                modalCancelButton: labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
                okFunctionState: this.deletCall,
                cancelFunctionState: this.cancelFunctionState
            }
        });
    }

    statusSwitch =( e )=>{
        let idfieldcastp = e.target.dataset.idfieldcastp;
        let ischecked = e.target.checked;
        console.log('----switch id: ', idfieldcastp)
        console.log('----switch id: ', ischecked)
    }

    cancelFunctionState =()=>{
        this.setState({modalVisible:false})
    }

    
    deletCall = () =>{
        let that  = this;
        this.setState({modalVisible:false})

        const deleteFieldRequest = axios.put( defines.API_DOMAIN + '/deletefieldcastp/'+this.state.idtodelete );

        axios.all([deleteFieldRequest]).then(axios.spread((...responses) => {
            const resp = responses[0];
        
            if(resp.status === 200 ) {
                console.log('=== data:', resp.data)
                this.confirmDeletedField(resp.data.data.status || 3);
                if (resp.data.data.status == 3) {
                    this.setState({
                        customFields: this.state.customFields.filter(customField => parseInt(customField.idfieldcastp) !== parseInt(that.state.idtodelete))
                    })    
                }else{
                    let temp_fields = this.state.customFields;
                    
                    temp_fields.map((field)=>{
                        if(field.idfieldcastp == that.state.idtodelete){
                            field.status = resp.data.data.status;
                        }
                    })
                    console.log('=== ', temp_fields)
                    this.setState({ customFields: temp_fields }) 
                }
                
            }else{
                throw new Error( JSON.stringify( {status: resp.status, error: resp.data.data.msg} ) );
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

    confirmDeletedField = (deleted_status) =>{

        this.setState({
            modalVisible:true,
            loading: false,
            modal:{
                modalType : deleted_status==2 ? 'warning': 'primary',
                modalBody : deleted_status==2 ? 'Este campo no puede eliminarse porque esta siendo usado. Su estado ha cambiado a deshabilitado.': labels.LVT_MODAL_DEFAULT_DELETION_SUCCESS_TEXT,
                modalTitle : labels.LVT_MODAL_DEFAULT_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.okFunction
            }
        });
    }

    okFunction = () =>{
        this.setState({modalVisible:false})
    }

    render() {
        // const customFieldList = this.state.customFields;
        const customFieldList = JSON.parse(localStorage.getItem("custompropsfields"));
        console.log('---- customFieldList: ', customFieldList)
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
                            <i className="fa fa-align-justify"></i> Dinámicos <small className="text-muted">Campos personalizados para utilería</small>
                        </CardHeader>
                        <CardBody>
                            <Table responsive hover bordered>
                                <thead>
                                    <tr>
                                        <th scope="col">No.</th>
                                        <th scope="col">Nombre</th>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">Categoría</th>
                                        <th scope="col">Tipo de Campo</th>
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
                                                    <td>{customField.idfieldcategory === 1 ? labels.LVT_LABEL_UTILERIA : labels.LVT_LABEL_VESTUARIO}</td>
                                                    <td>
                                                        <ul>
                                                            <li>
                                                                {customField.idfieldcategory === 1 ? 'Casa' : 'Hombre'}
                                                            </li>
                                                            <li>
                                                                {customField.idfieldcategory === 1 ? 'Oficina' : 'Niño'}
                                                            </li>
                                                        </ul>
                                                    </td>
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
                                                        
                                                        { customField.status == 1 &&
                                                            <React.Fragment>
                                                                <Link to={`/customfield/${customField.idfieldcastp}/edit`} outline className="btn btn-dark btn-sm" size="sm">
                                                                    <i className="fa fa-edit"></i>
                                                                </Link>
                                                                <Button outline color="dark" size="sm" className="ml-1" onClick={() => this.handleDelete(customField.idfieldcastp)}>
                                                                    <i className="fa fa-trash"></i>
                                                                </Button>
                                                            </React.Fragment>
                                                        }
                                                        
                                    
                                                    </td>
                                                    <td>
                                                        <AppSwitch className={'mx-1'} color={'dark'} checked={customField.status == 2? false : true} data-idfieldcastp={customField.idfieldcastp} onChange={this.statusSwitch} />
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