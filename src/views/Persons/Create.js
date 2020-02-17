import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
import defines from '../../defines'
import CustomField from '../CustomField/CustomField';
import RUG, { DragArea, DropArea} from 'react-upload-gallery'
import CustomModal from '../Notifications/Modals/CustomModal';
import 'react-upload-gallery/dist/style.css'
import labels from '../../labels'

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

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const inputParsers = {
  date(input) {
    const [month, day, year] = input.split('/');
    return `${year}-${month}-${day}`;
  },
  uppercase(input) {
    return input.toUpperCase();
  },
  number(input) {
    return parseFloat(input);
  },
};

function GenderRadioOption(props){
  const gender = props.gender;
  
  return(
    <FormGroup check inline>
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

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: {
        lvtDNI : '',
        lvtFirstname : '',
        lvtLastname : '',
        lvtDateOfBirth : '',
        lvtGender : '',
        lvtHeight : '',
        lvtWeight : '',
        lvtRUC : '',
        lvtEmail : '',
        lvtCellphone : '',
        lvtPhone : '',
        lvtAddress : '',
        lvtVideo : '',
        lvtObservations : '',
      },
      loading: false,
      error: false,
      redirect: false,
      genders: [],
      customFields: [],
      customFieldsData: [],
      lvtImages: [],
      lvtVideos: [],
      modalVisible: false,
      modalData:{
        modalType : 'primary',
        modalTitle : labels.LVT_MODAL_DEFAULT_TITLE,
        modalBody : 'Body',
        modalOkButton : labels.LVT_MODAL_DEFAULT_BUTTON_OK,
        modalCancelButton : labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
      },
      errorFields: {
        valid: [],
        invalid: []
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.inputRadioHandler = this.inputRadioHandler.bind(this);
    this.customInputChangeHandler = this.customInputChangeHandler.bind(this);
  }

  handleInitUpload() {
    //console.log("FilePond instance has initialised", this.pond);
    console.log("FilePond instance has initialised");
  }

  inputChangeHandler(e) {
    let formFields = {...this.state.formFields};
    formFields[e.target.name] = e.target.value;
    this.setState({ 
      formFields:formFields
    });
  }

  inputRadioHandler(e){
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
    this.setState({ customFieldsData: customFieldsData });
    console.log(this.state);
  }

  addFormError(fieldError) {
    if( this.state.errorFields.invalid.indexOf(fieldError) <= -1 ){
      let invalidErrorFields = this.state.errorFields.invalid;
      let validErrorFields = this.state.errorFields.valid;
      validErrorFields.splice( validErrorFields.indexOf(fieldError), 1 )
      invalidErrorFields.push(fieldError);
      this.setState({
        errorFields:{
          valid : validErrorFields,
          invalid : invalidErrorFields,
        }
      });
    }
  }
  removeFormError(fieldError) {
    if( this.state.errorFields.invalid.indexOf(fieldError) > -1 ){
      let invalidErrorFields = this.state.errorFields.invalid;
      let validErrorFields = this.state.errorFields.valid;
      invalidErrorFields.splice( invalidErrorFields.indexOf(fieldError), 1 )
      validErrorFields.push(fieldError);
      this.setState({
        errorFields:{
          valid : validErrorFields,
          invalid : invalidErrorFields,
        }
      });
    }
  }

  checkFormFields(){
    if ( this.state.formFields.lvtDNI === '' ){
      this.addFormError('lvtDNI');
    }else{
      this.removeFormError('lvtDNI');
    }
    if ( this.state.formFields.lvtFirstname === '' ){
      this.addFormError('lvtFirstname');
    }else{
      this.removeFormError('lvtFirstname');
    }
    if ( this.state.formFields.lvtLastname === '' ){
      this.addFormError('lvtLastname');
    }else{
      this.removeFormError('lvtLastname');
    }
    if ( this.state.formFields.lvtDateOfBirth === '' ){
      this.addFormError('lvtDateOfBirth');
    }else{
      this.removeFormError('lvtDateOfBirth');
    }
    if ( this.state.formFields.lvtDateOfBirth === '' ){
      this.addFormError('lvtDateOfBirth');
    }else{
      this.removeFormError('lvtDateOfBirth');
    }
    if ( this.state.formFields.lvtGender === '' ){
      this.addFormError('lvtGender');
    }else{
      this.removeFormError('lvtGender');
    }
    if ( this.state.formFields.lvtHeight === '' ){
      this.addFormError('lvtHeight');
    }else{
      this.removeFormError('lvtHeight');
    }
    if ( this.state.formFields.lvtWeight === '' ){
      this.addFormError('lvtWeight');
    }else{
      this.removeFormError('lvtWeight');
    }
    if ( this.state.formFields.lvtRUC === '' ){
      this.addFormError('lvtRUC');
    }else{
      this.removeFormError('lvtRUC');
    }
    if ( this.state.formFields.lvtEmail === '' ){
      this.addFormError('lvtEmail');
    }else{
      this.removeFormError('lvtEmail');
    }
    if ( this.state.formFields.lvtCellphone === '' ){
      this.addFormError('lvtCellphone');
    }else{
      this.removeFormError('lvtCellphone');
    }
    if ( this.state.formFields.lvtAddress === '' ){
      this.addFormError('lvtAddress');
    }else{
      this.removeFormError('lvtAddress');
    }
  }


  handleSubmit(event) {
    event.preventDefault();

    this.checkFormFields();

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

    // Get images uploaded
    let imagesPerson = this.state.lvtImages.map(function(imagePerson) {
      return {
        thumbnail: imagePerson.imgThumbnail,
        optimized: imagePerson.imgOptimized,
        original: imagePerson.imgOriginal
      }
    });
    
    // Get video uploaded
    let videosPerson = this.state.lvtVideos.map(function(videoPerson) {
      return {
        path: videoPerson.filename,
      }
    });
    
    // Setting data to request
    const personData = {
      dni: this.state.formFields.lvtDNI,
      firstname: this.state.formFields.lvtFirstname,
      lastname: this.state.formFields.lvtLastname,
      dob: this.state.formFields.lvtDateOfBirth,
      idgender: this.state.formFields.lvtGender,
      height: parseInt( this.state.formFields.lvtHeight ),
      weight: parseInt( this.state.formFields.lvtWeight ),
      ruc: this.state.formFields.lvtRUC,
      email: this.state.formFields.lvtEmail,
      phone1: this.state.formFields.lvtCellphone,
      phone2: this.state.formFields.lvtPhone,
      address: this.state.formFields.lvtAddress,
      observations: this.state.formFields.lvtObservations,
      formcastp: formcastp,
      images: imagesPerson,
      videos: videosPerson,
      createdby: 1,
      idcity: 1,
    };

    console.log(JSON.stringify(personData));

    if( this.state.errorFields.invalid.length === 0 ){
      this.setState({ loading: true });
      axios.post(
        defines.API_DOMAIN + '/person/', 
        personData
      )
      .then( (response) => {
        if(response.status === 200 ) {
          this.setState({ loading: false, redirect: true });
        }else{
          throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
        }
      })
      .catch( (error) => {
        if (error.response) {
          this.setState({
            modalData:{
              modalType : 'danger',
              modalBody : error.response.data.data.msg
            }
          });
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
        this.setState({ loading: false, error: true, modalVisible: true });
      });
    } else {
      this.setState({
        modalData:{
          modalType : 'danger',
          modalTitle : labels.LVT_MODAL_DEFAULT_TITLE,
          modalBody : labels.LVT_ERROR_FIELDS_MESSAGE,
          modalOkButton : labels.LVT_MODAL_DEFAULT_BUTTON_OK,
          modalCancelButton : labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
        }
      });
      this.setState({ loading: false, error: true, modalVisible: true });
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

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const gendersList = this.state.genders;
    const customFieldList = this.state.customFields;

    if (this.state.redirect) {
      return <Redirect to='/person/list'/>;
    }
    if (this.state.loading) {
      return(
        <div>
          <p> Loading... </p>
        </div>
      )
    }
    // if (this.state.error || !this.state.formFields[0]) {// if request failed or data is empty don't try to access it either
    //   return(
    //     <div>
    //       <p> An error occured </p>
    //     </div>
    //   )
    // }
    return (
      <div className="animated fadeIn">
        { 
          (this.state.modalVisible) ?
            <CustomModal
              modalType = {this.state.modalData.modalType}
              modalTitle = {this.state.modalData.modalTitle}
              modalBody = {this.state.modalData.modalBody}
              labelOkButton = {this.state.modalData.modalOkButton}
              labelCancelButton = {this.state.modalData.modalCancelButton}
            />
          : ''
        }
        <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-person" onSubmit={this.handleSubmit} >
          <Row>
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Información</strong> Datos personales
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtDNI">Cédula</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtDNI"
                        name="lvtDNI"
                        placeholder="09999999999"
                        autoComplete="nope"
                        value={this.state.formFields.lvtDNI}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid = { this.state.errorFields.valid.indexOf("lvtDNI") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtDNI") > -1 }
                      />
                      <FormText color="muted">Cédula/DNI/Pasaporte </FormText>
                    </Col>
                  </FormGroup>

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
                        autoComplete="nope"
                        value={this.state.formFields.lvtFirstname}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid = { this.state.errorFields.valid.indexOf("lvtFirstname") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtFirstname") > -1 }
                      />
                      <FormText color="muted">Nombres de la persona</FormText>
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
                        autoComplete="nope"
                        value={this.state.formFields.lvtLastname}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid = { this.state.errorFields.valid.indexOf("lvtLastname") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtLastname") > -1 }
                      />
                      <FormText color="muted">Apellidos de la persona</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtDateOfBirth">Fecha de nacimiento </Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-calendar"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="date"
                          id="lvtDateOfBirth"
                          name="lvtDateOfBirth"
                          placeholder=""
                          value={this.state.formFields.lvtDateOfBirth}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid = { this.state.errorFields.valid.indexOf("lvtDateOfBirth") > -1 }
                          invalid = { this.state.errorFields.invalid.indexOf("lvtDateOfBirth") > -1 }
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>

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
                          onGenderFieldChange = {(e) => this.inputRadioHandler.call(this, e)}
                        />
                      )}
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtRUC">RUC</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="text"
                        id="lvtRUC"
                        name="lvtRUC"
                        placeholder="09999999999001"
                        autoComplete="nope"
                        value={this.state.formFields.lvtRUC}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid = { this.state.errorFields.valid.indexOf("lvtRUC") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtRUC") > -1 }
                      />
                      <FormText color="muted">Dato para facturación</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>

            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Contacto</strong> Datos de contacto
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtEmail">Email</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="email"
                        id="lvtEmail"
                        name="lvtEmail"
                        placeholder="Ingrese email"
                        autoComplete="nope"
                        value={this.state.formFields.lvtEmail}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        valid = { this.state.errorFields.valid.indexOf("lvtEmail") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtEmail") > -1 }
                      />
                      <FormText className="help-block">Ingrese correo electrónico</FormText>
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtCellphone">Celular</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-phone"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="lvtCellphone"
                          name="lvtCellphone"
                          placeholder="593987654321"
                          autoComplete="nope"
                          value={this.state.formFields.lvtCellphone}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid = { this.state.errorFields.valid.indexOf("lvtCellphone") > -1 }
                          invalid = { this.state.errorFields.invalid.indexOf("lvtCellphone") > -1 }
                        />
                      </InputGroup>
                      <FormText color="muted">Teléfono celular</FormText>
                    </Col>
                  </FormGroup>
                  
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtPhone">Teléfono</Label>
                    </Col>
                    <Col xs="12" md="9">
                    <InputGroup>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-phone"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          id="lvtPhone"
                          name="lvtPhone"
                          placeholder="042999999"
                          autoComplete="nope"
                          value={this.state.formFields.lvtPhone}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid = { this.state.errorFields.valid.indexOf("lvtPhone") > -1 }
                          invalid = { this.state.errorFields.invalid.indexOf("lvtPhone") > -1 }
                        />
                      </InputGroup>
                      <FormText color="muted">Teléfono fijo principal</FormText>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtAddress">Dirección</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="lvtAddress"
                        id="lvtAddress"
                        rows="3"
                        placeholder="Urdesa Central, Cedros 215 y Victor Emilio Estrada"
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        value={this.state.formFields.lvtAddress}
                        valid = { this.state.errorFields.valid.indexOf("lvtAddress") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtAddress") > -1 }
                      />
                      <FormText color="muted">Dirección de domicilio o de contacto principal</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
            
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Otros</strong> Características adicionales
                </CardHeader>
                <CardBody>
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtHeight">Estatura</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          id="lvtHeight"
                          name="lvtHeight"
                          placeholder="170"
                          value={this.state.formFields.lvtHeight}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid = { this.state.errorFields.valid.indexOf("lvtHeight") > -1 }
                          invalid = { this.state.errorFields.invalid.indexOf("lvtHeight") > -1 }
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {defines.LVT_HEIGHT_UNIT}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText color="muted">Escribe cuánto mide la persona</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtWeight">Peso</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          id="lvtWeight"
                          name="lvtWeight"
                          placeholder="63"
                          value={this.state.formFields.lvtWeight}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                          valid = { this.state.errorFields.valid.indexOf("lvtWeight") > -1 }
                          invalid = { this.state.errorFields.invalid.indexOf("lvtWeight") > -1 }
                        />
                        <InputGroupAddon addonType="append">
                          <InputGroupText>
                            {defines.LVT_WEIGHT_UNIT}
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FormText color="muted">Escribe cuánto pesa la persona</FormText>
                    </Col>
                  </FormGroup>
                  {( customFieldList || []).map((customFieldObj, index) =>
                    <CustomField 
                      key={index}
                      customFieldObj={customFieldObj}
                      customFieldValue = {this.state.customFieldsData[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp]}
                      onCustomFieldChange = {(e) => this.customInputChangeHandler.call(this, e)}
                      errorFields = { this.state.errorFields }
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
            
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Complementarios</strong> Datos adicionales
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtObservations">Observaciones</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="textarea"
                        name="lvtObservations"
                        id="lvtObservations"
                        rows="4"
                        placeholder="Ingrese observaciones de la persona"
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                        value={this.state.formFields.lvtObservations}
                        valid = { this.state.errorFields.valid.indexOf("lvtObservations") > -1 }
                        invalid = { this.state.errorFields.invalid.indexOf("lvtObservations") > -1 }
                      />
                      <FormText color="muted">Comentarios y observaciones referentes a la ficha ingresada</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xs="12" md="12">
              <Card>
                <CardHeader>
                  <strong>Multimedia</strong> Imágenes
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col xs="12" md="12">
                        <RUG
                          rules = {{
                            limit: 10,
                            size: 20000
                          }}

                          accept = {['jpg', 'jpeg', 'png']}

                          action = {defines.API_DOMAIN + '/uploadimages'}

                          source = {(response) => {
                            return response.images;
                          }}

                          onWarning = {(type, rules) => {
                            switch(type) {
                              case 'accept':
                                console.log(`Only ${rules.accept.join(', ')}`)
                                break;
                        
                              case 'limit':
                                console.log('limit <= ', rules.limit)
                                break;

                              case 'size':
                                console.log('max size <= ', rules.size)
                                break;
                        
                              case 'minWidth': case 'minHeight':
                                console.log('Dimensions > ', `${rules.width.min}x${rules.height.min}`)
                                break;
                        
                              case 'maxWidth': case 'maxHeight':
                                console.log('Dimensions < ', `${rules.width.max}x${rules.height.max}`)
                                break;
                        
                              default:
                                break;
                            }
                          }}

                          // onChange = {(imagesUploaded) => {
                          //   this.setState({ lvtImages: imagesUploaded })
                          // }}

                          onSuccess = {(imageUploaded) => {
                            let arrImages = this.state.lvtImages
                            arrImages.push({
                              "uid": imageUploaded.uid,
                              "path": defines.API_DOMAIN + defines.PERSON_PATH_IMG_THUMBNAIL + '/' + imageUploaded.source.imgThumbnail,
                              "imgThumbnail": imageUploaded.source.imgThumbnail,
                              "imgOptimized": imageUploaded.source.imgOptimized,
                              "imgOriginal": imageUploaded.source.imgOriginal
                            })
                            this.setState({ lvtImages: arrImages })
                          }}
                          
                          onConfirmDelete = {(currentImage, images) => {
                            return window.confirm(`¿Seguro que desea eliminar '${currentImage.source.originalname}'?`)
                          }}

                          onDeleted={(deletedImage, images) => {
                            let arrImages = this.state.lvtImages.filter(function(item) {
                              if(item.uid !== deletedImage.uid){
                                return true
                              }
                              return false;
                            })
                            
                            if ( deletedImage.selected && images.length ) {
                              images[0].select()
                            }

                            this.setState({ lvtImages: arrImages })
                          }}
                        />
                    </Col>
                  </FormGroup>

                </CardBody>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Multimedia</strong> Video
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtVideo">Vídeo</Label>
                    </Col>
                    <Col xs="12" md="9">
                        <FilePond
                          ref={ref => (this.pond = ref)}
                          // files={this.state.lvtVideos}
                          allowMultiple={true}
                          allowDrop={false}
                          acceptedFileTypes={['video/*']}
                          server={defines.API_DOMAIN + '/uploadvideo'}
                          oninit={() => this.handleInitUpload()}
                          onprocessfile = {(error, file) => {
                            let processedFile = JSON.parse(file.serverId);
                            let arrVideos = this.state.lvtVideos;
                            arrVideos.push({
                              "filename": processedFile.video,
                            })
                            this.setState({ lvtVideos: arrVideos })
                          }}

                          // onupdatefiles={(fileItems) => {
                          //   this.setState({
                          //     lvtVideos: fileItems.map(fileItem => fileItem.filename)
                          //   });
                          //   console.log(this.state.lvtVideos);
                          // }}
                        />
                      <FormText color="muted">Vídeo a mostrar</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
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
