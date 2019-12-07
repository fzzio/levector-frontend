import React, { Component, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
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
  Table,
  Row,
} from 'reactstrap';
import axios from 'axios';
import defines from '../../defines'

class List extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customFields: [],
            limit: 8,
            offset: 0,
            loading: true,
            error: false,
        }
    }

    componentDidMount() {
        // fetch all API data
        const requestCustomFields = axios.get( defines.API_DOMAIN + '/allfieldcastopp' );
        axios.all([requestCustomFields]).then(axios.spread((...responses) => {
            const responseCustomFields = responses[0];
        
            if(responseCustomFields.status === 200 ) {
                this.setState({ 
                    customFields: responseCustomFields.data.data,
                });
            }else{
                throw new Error( JSON.stringify( {status: responseCustomFields.status, error: responseCustomFields.data.data.msg} ) );
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
        const customFieldList = this.state.customFields;
        return (
            <div className="animated fadeIn">
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {customFieldList.map((customField, index) =>
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
                                                                    {customFieldItem.value}
                                                                </li>
                                                            )}
                                                        </ul>
                                                    :   ''
                                                }
                                            </td>
                                            <td>
                                                <Button outline color="dark" size="sm">
                                                    <i className="fa fa-edit"></i>
                                                </Button>
                                                <Button outline color="dark" size="sm" className="ml-1">
                                                    <i className="fa fa-trash"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    )}
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