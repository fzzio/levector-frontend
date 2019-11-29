import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Container,
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
    Row,
  } from 'reactstrap';
import { isNull } from 'util';
import moment from 'moment';
import defines from '../../../defines'
import CustomField from '../CustomField/CustomField';

function GenderRadioOption(props){
    const gender = props.gender;
    
    return(
      <FormGroup check>
        <Input
            className="form-check-input"
            type="radio"
            id={"lvtGender_" + gender.idgender}
            name="lvtGender"
            value={gender.idgender}
            checked={gender.idgender === props.genderValue}
            onChange={props.onGenderFieldChange}
        />
        <Label className="form-check-label" check htmlFor={`lvtGender_` + gender.idgender}>{gender.name}</Label>
      </FormGroup>
    );
  }

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formFields: {
                lvtDNI : '',
                lvtFirstname : '',
                lvtLastname : '',
                lvtDateOfBirth : '',
                lvtGender : '',
                lvtRUC : '',
                lvtEmail : '',
                lvtCellphone : '',
                lvtPhone : '',
                lvtAddress : '',
                lvtVideo : '',
                lvtObservations : '',
            },
            genders: [],
            customFields: [],
            persons: [],
        }
    }

    componentDidMount() {
        // fetch all API data
        const requestGender = axios.get( defines.API_DOMAIN + '/gender' );
        const requestCustomFields = axios.get( defines.API_DOMAIN + '/allfieldcastopp' );
        axios.all([requestGender, requestCustomFields]).then(axios.spread((...responses) => {
            const responseGender = responses[0];
            const responseCustomFields = responses[1];
            if(responseGender.status === 200 ) {
                this.setState({ genders: responseGender.data.data })
            }else{
                throw new Error( JSON.stringify( {status: responseCustomFields.status, error: responseCustomFields.data.data.msg} ) );
            }
        
            if(responseCustomFields.status === 200 ) {
                let customFieldElements = responseCustomFields.data.data.map( ( responseCustomField ) => {
                let customFieldElement = {
                    name: defines.CUSTOM_FIELD_PREFIX + responseCustomField.idfieldcastp,
                    value: '',
                    idfieldcastp: responseCustomField.idfieldcastp,
                };
                return customFieldElement;
                } );
        
                this.setState({ 
                customFields: responseCustomFields.data.data,
                customFieldsData: customFieldElements
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

    customInputChangeHandler(e) {
        let customFieldsData = this.state.customFieldsData;
        const index = customFieldsData.findIndex(item => (item.name === e.target.name));
        if( index >= 0 ){
            customFieldsData[index].value = e.target.value;
        }
    }
    
    customInputRadioHandler(e){
        let formFields = this.state.formFields;
        formFields[e.target.name] = parseInt(e.target.value);
        this.setState({ formFields });
        console.log( this.state );
    }

    render() {
        const gendersList = this.state.genders;
        const customFieldList = this.state.customFields;
        return(
            <Row>
                <Col xl={12}>
                    <Card>
                    <CardHeader>
                        <i className="fa fa-align-justify"></i> Búsqueda <small className="text-muted"> Filtros de selección</small>
                    </CardHeader>
                    <CardBody>
                        <Form action="" method="post" className="form-horizontal" id="lvt-form-search" >
                        <Row>
                            <Col md="4">
                                <FormGroup row>
                                    <Col md="3">
                                    <Label>Género</Label>
                                    </Col>
                                    <Col md="9">
                                    {gendersList.map((gender, index) =>
                                        <GenderRadioOption 
                                            key={index} 
                                            gender={gender}
                                            genderValue = {this.state.formFields.lvtGender}
                                            onGenderFieldChange = {(e) => this.customInputRadioHandler.call(this, e)}
                                        />
                                    )}
                                    </Col>
                                </FormGroup>
                            </Col>
                            <Col md="4">
                                {( customFieldList || []).map((customFieldObj, index) =>
                                    <CustomField 
                                        key={index}
                                        customFieldObj={customFieldObj}
                                        customFieldValue = {this.state.customFieldsData[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp]}
                                        onCustomFieldChange = {(e) => this.customInputChangeHandler.call(this, e)}
                                        isSearch = { true }
                                    />
                                )}
                            </Col>
                            <Col md="4">
                                
                            </Col>
                        </Row>
                        </Form>
                    </CardBody>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default SearchForm;
