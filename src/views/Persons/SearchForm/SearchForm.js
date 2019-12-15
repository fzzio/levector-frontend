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
    Collapse,
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
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

// import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
// const Handle = Slider.Handle;

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
                lvtFirstname : '',
                lvtLastname : '',
                lvtGender : '',
            },
            lvtAge : { min: defines.LVT_AGE_MIN, max: defines.LVT_AGE_MAX },
            lvtHeight : { min: defines.LVT_HEIGHT_MIN, max: defines.LVT_HEIGHT_MAX },
            lvtWeight : { min: defines.LVT_WEIGHT_MIN, max: defines.LVT_WEIGHT_MAX },
            genders: [],
            customFields: [],
            customFieldsData: [],
            loading: false,
            error: false,
            collapseSearchForm: false,
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.customInputChangeHandler = this.customInputChangeHandler.bind(this);
        this.customInputRadioHandler = this.customInputRadioHandler.bind(this);
        this.rangeAgeChangeHandler = this.rangeAgeChangeHandler.bind(this);
        this.rangeHeightChangeHandler = this.rangeHeightChangeHandler.bind(this);
        this.rangeWeightChangeHandler = this.rangeWeightChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleSearchForm = this.toggleSearchForm.bind(this);
    }

    toggleSearchForm() {
        this.setState({ collapseSearchForm: !this.state.collapseSearchForm });
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
                throw new Error( JSON.stringify( {status: responseGender.status, error: responseGender.data.data.msg} ) );
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

    inputChangeHandler(e) {
        let formFields = this.state.formFields;
        formFields[e.target.name] = e.target.value;
        this.setState({ formFields });
    }

    customInputRadioHandler(e){
        let formFields = this.state.formFields;
        formFields[e.target.name] = parseInt(e.target.value);
        this.setState({ formFields });
    }

    customInputChangeHandler(e) {
        let customFieldsData = this.state.customFieldsData;
        const index = customFieldsData.findIndex(item => (item.name === e.target.name));
        if( index >= 0 ){
            customFieldsData[index].value = e.target.value;
        }
        this.setState({ customFieldsData });
    }

    rangeAgeChangeHandler(e){
        this.setState({ lvtAge: {min: e[0], max: e[1]} })
    }
    rangeHeightChangeHandler(e){
        this.setState({ lvtHeight: {min: e[0], max: e[1]} })
    }
    rangeWeightChangeHandler(e){
        this.setState({ lvtWeight: {min: e[0], max: e[1]} })
    }

    handleSubmit(event) {
        event.preventDefault();

        // Get data from Custom field
        let formcastp = this.state.customFieldsData.filter(function(customFieldData) {
            if( customFieldData.value === null || customFieldData.value === undefined || customFieldData.value === '' ){
                return false; // skip
            }
            return true;
        }).map(function(customFieldData) {
            return {
                idfieldcastp: customFieldData.idfieldcastp,
                value: customFieldData.value,
            }
        })

        // Setting data to request
        const personSearchData = {
            firstname: this.state.formFields.lvtFirstname,
            lastname: this.state.formFields.lvtLastname,
            minAge: this.state.lvtAge.min,
            maxAge: this.state.lvtAge.max,
            minHeight: this.state.lvtHeight.min,
            maxHeight: this.state.lvtHeight.max,
            minWeight: this.state.lvtWeight.min,
            maxWeight: this.state.lvtWeight.max,
            gender: this.state.formFields.lvtGender,
            formcastp: formcastp,
            limit: this.props.limit,
            offset: this.props.offset,
        };
        console.log(personSearchData)

        this.setState({ loading: true });
        axios.post(
            defines.API_DOMAIN + '/searchperson/', 
            personSearchData
          )
          .then( (response) => {
            if(response.status === 200 ) {
                this.setState(
                    { 
                        loading: false,
                        persons: response.data.data
                    }
                );
                this.props.handleResults( response.data.data );
            }else{
                throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
            }
          })
          .catch( (error) => {
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

    render() {
        const gendersList = this.state.genders;
        const customFieldList = this.state.customFields;
        return(
            <Row>
                <Col xl={12}>
                    <Form action="" method="post" className="form-horizontal" id="lvt-form-search" >
                        <Card>
                            <CardHeader>
                                <i className="fa fa-search"></i> Búsqueda <small className="text-muted"> Filtros de selección</small>
                                <div className="card-header-actions">
                                    <Button color="link" className="card-header-action btn-minimize" data-target="#collapseSearch" onClick={this.toggleSearchForm}>
                                        <i className="icon-arrow-down"></i>
                                    </Button>
                                </div>
                            </CardHeader>
                            <Collapse isOpen={this.state.collapseSearchForm} id="collapseSearch">
                                <CardBody>
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
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Edad</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_AGE_MIN}
                                                        max={defines.LVT_AGE_MAX}
                                                        defaultValue={[18, 35]}
                                                        marks={{ 
                                                            0: defines.LVT_AGE_MIN,
                                                            100: defines.LVT_AGE_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_AGE_UNIT}s`}
                                                        onChange = {(e) => this.rangeAgeChangeHandler.call(this, e)}
                                                        allowCross = {false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Estatura</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_HEIGHT_MIN}
                                                        max={defines.LVT_HEIGHT_MAX}
                                                        defaultValue={[140, 180]}
                                                        marks={{
                                                            0: defines.LVT_HEIGHT_MIN,
                                                            240: defines.LVT_HEIGHT_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_HEIGHT_UNIT}`}
                                                        onChange = {(e) => this.rangeHeightChangeHandler.call(this, e)}
                                                        allowCross = {false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Peso</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_WEIGHT_MIN}
                                                        max={defines.LVT_WEIGHT_MAX}
                                                        defaultValue={[60, 90]}
                                                        marks={{ 
                                                            0: defines.LVT_WEIGHT_MIN,
                                                            150: defines.LVT_WEIGHT_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_WEIGHT_UNIT}`}
                                                        onChange = {(e) => this.rangeWeightChangeHandler.call(this, e)}
                                                        allowCross = {false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="4">
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label htmlFor="lvtFirstname">Nombres</Label>
                                                </Col>
                                                <Col xs="12" md="9">
                                                    <Input
                                                        type="text"
                                                        id="lvtFirstname"
                                                        name="lvtFirstname"
                                                        placeholder="Juan"
                                                        value={this.state.formFields.lvtFirstname}
                                                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label htmlFor="lvtLastname">Apellidos</Label>
                                                </Col>
                                                <Col xs="12" md="9">
                                                    <Input 
                                                        type="text"
                                                        id="lvtLastname"
                                                        name="lvtLastname"
                                                        placeholder="Pérez"
                                                        value={this.state.formFields.lvtLastname}
                                                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                        <Col md="4">
                                            {(customFieldList.length > 0) ?
                                                customFieldList.map((customFieldObj, index) =>
                                                    <CustomField 
                                                        key={index}
                                                        customFieldObj={customFieldObj}
                                                        customFieldValue = {this.state.customFieldsData[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp]}
                                                        onCustomFieldChange = {(e) => this.customInputChangeHandler.call(this, e)}
                                                        isSearch = { true }
                                                    />
                                                )
                                                :
                                                <p className="form-control-static">No existen elementos</p>
                                            }
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Collapse>
                            <CardFooter>
                                <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} >
                                    <i className="fa fa-search"></i> Buscar
                                </Button>
                                {/* <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Limpiar</Button> */}
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default SearchForm;
