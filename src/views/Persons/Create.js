import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
import defines from '../../defines'
import CustomField from './CustomField/CustomField';
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

  //const genderValue = props.genderValue;
  //const genderValue = props.genderValue;
  //const onGenderFieldChange = ((event) => {
    //this.props.onCustomFieldChange(e);
    //return gender.props.onCustomFieldChange(event);
  //});
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
        lvtRUC : '',
        lvtEmail : '',
        lvtCellphone : '',
        lvtPhone : '',
        lvtAddress : '',
        lvtImages : '',
        lvtVideo : '',
        lvtObservations : '',
      },
      loading: false,
      error: false,
      redirect: false,
      genders: [],
      customFields: [],
      customFieldsData: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.customInputRadioHandler = this.customInputRadioHandler.bind(this);
    this.customInputChangeHandler = this.customInputChangeHandler.bind(this);
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

  inputChangeHandler(e) {
    let formFields = {...this.state.formFields};
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
  }

  handleSubmit(event) {
    event.preventDefault();

    let formcastp = this.state.customFieldsData.filter(function(customFieldData) {
      if( customFieldData.value === null || customFieldData.value === undefined || customFieldData.value === '' ){
        return false; // skip
      }
      return true;
    }).map(function(customFieldData) {
      return {
        idfieldcastp: customFieldData.idfieldcastp,
        idfieldopcastp: '',
        value: customFieldData.value,
      }
    })
    
    const personData = {
      passport: this.state.formFields.lvtDNI,
      firstname: this.state.formFields.lvtFirstname,
      lastname: this.state.formFields.lvtLastname,
      dob: this.state.formFields.lvtDateOfBirth,
      gender: this.state.formFields.lvtGender,
      ruc: this.state.formFields.lvtRUC,
      email: this.state.formFields.lvtEmail,
      phone1: this.state.formFields.lvtCellphone,
      phone2: this.state.formFields.lvtPhone,
      address: this.state.formFields.lvtAddress,
      observations: this.state.formFields.lvtObservations,
      // unused
      //images: this.state.formFields.lvtImages,
      //video: this.state.formFields.lvtVideo 
      // temporal
      createdby: 1,
      formcastp: formcastp
    };

    // console.log(personData);

    // this.setState({ loading: true });
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
        console.log(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error', error.message);
      }
      //this.setState({ loading: false, error: true });
    });
  }
  
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
                        value={this.state.formFields.lvtDNI}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                        value={this.state.formFields.lvtFirstname}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                        value={this.state.formFields.lvtLastname}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                          onGenderFieldChange = {(e) => this.customInputRadioHandler.call(this, e)}
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
                        value={this.state.formFields.lvtRUC}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                        autoComplete="email"
                        value={this.state.formFields.lvtEmail}
                        onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                          value={this.state.formFields.lvtCellphone}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                          value={this.state.formFields.lvtPhone}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
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
                  <strong>Otros</strong> Datos adicionales
                </CardHeader>
                <CardBody>
                  {( customFieldList || []).map((customFieldObj, index) =>
                    <CustomField 
                      key={index}
                      customFieldObj={customFieldObj}
                      customFieldValue = {this.state.customFieldsData[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp]}
                      onCustomFieldChange = {(e) => this.customInputChangeHandler.call(this, e)}
                    />
                  )}
                </CardBody>
              </Card>
            </Col>
            
            <Col xs="12" md="6">
              <Card>
                <CardHeader>
                  <strong>Multimedia</strong> Imágenes y video
                </CardHeader>
                <CardBody>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtImages">Imágenes</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="lvtImages" name="lvtImages" multiple />
                      <FormText color="muted">Imágenes de la persona</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtVideo">Vídeo</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="lvtVideo" name="lvtVideo" />
                      <FormText color="muted">Vídeo a mostrar</FormText>
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
                        placeholder="Igrese texto..."
                      />
                      <FormText color="muted">Comentarios y observaciones referentes a la ficha ingresada</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Card>
            <CardFooter>
              <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} ><i className="fa fa-dot-circle-o"></i> Guardar</Button>
              <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Limpiar</Button>
            </CardFooter>
          </Card>
        </Form>
      </div>
    );
  }
}

export default Create;
