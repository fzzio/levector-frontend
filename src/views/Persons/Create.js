import React, { Component } from 'react';
import { Redirect } from 'react-router'
import axios from 'axios';
import defines from '../../defines'
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
  return(
    <FormGroup check inline>
      <Input
        className="form-check-input"
        type="radio"
        id={`lvtGender_` + gender.idgender}
        name="lvtGender"
        value={gender.idgender}
      />
      <Label className="form-check-label" check htmlFor={`lvtGender_` + gender.idgender}>{gender.name}</Label>
    </FormGroup>
  );
}
function CustomFieldsItems(props){
  const customField = props.customField;
  switch (customField.idfieldtype) {
    // case defines.CUSTOM_FIELD_CHECKBOX:
    //   return(
    //     <FormGroup row>
    //       <Col md="3"><Label>{customField.value}</Label></Col>
    //       <Col md="9">
    //         {/* { ( customField.hasOwnProperty('values') ) 
    //           ? customField.values.map((value, index) => {
    //               return (
    //                 <FormGroup check className="checkbox">
    //                   <Input
    //                     className="form-check-input"
    //                     type="checkbox"
    //                     id="checkbox1"
    //                     name="checkbox1"
    //                     value={value}
    //                     idfieldcastp = {customField.idfieldcastp}
    //                   />
    //                   <Label check className="form-check-label" htmlFor="checkbox1">Option 1</Label>
    //                 </FormGroup>
    //               )
    //             })
    //           : <Col xs="12" md="9">
    //             <p className="form-control-static">No existen opciones</p>
    //           </Col>
    //         } */}
    //           <FormGroup check className="checkbox">
    //             <Input
    //               className="form-check-input"
    //               type="checkbox"
    //               id="checkbox1"
    //               name="checkbox1"
    //             />
    //             <Label check className="form-check-label" htmlFor="checkbox1">Option 1</Label>
    //           </FormGroup>
    //       </Col>
    //     </FormGroup>
    //   );
    //   break;

    case defines.CUSTOM_FIELD_TEXTAREA:
      return(
        <FormGroup row>
          <Col md="3">
            <Label htmlFor={`lvtCustomField_` + customField.idfieldcastp}>{customField.value}</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="textarea"
              name={`lvtCustomField_` + customField.idfieldcastp}
              id={`lvtCustomField_` + customField.idfieldcastp}
              rows="5"
              placeholder="..."
              idfieldcastp = {customField.idfieldcastp}
            />
          </Col>
        </FormGroup>
      );
      break;

    // case defines.CUSTOM_FIELD_LIST:
    //   return(
    //     <FormGroup row>
    //     <Col md="3">
    //       <Label htmlFor={`lvtCustomField_` + customField.idfieldcastp}>{customField.value}</Label>
    //     </Col>
    //     <Col md="9">
    //       <Input
    //         type="select" 
    //         name={`lvtCustomField_` + customField.idfieldcastp}
    //         id={`lvtCustomField_` + customField.idfieldcastp}
    //         idfieldcastp = {customField.idfieldcastp}
    //         multiple >
    //         <option value="1">Option #1</option>
    //         <option value="2">Option #2</option>
    //         <option value="3">Option #3</option>
    //         <option value="4">Option #4</option>
    //         <option value="5">Option #5</option>
    //       </Input>
    //     </Col>
    //     </FormGroup>
    //   );
    //   break;

    // case defines.CUSTOM_FIELD_COMBOBOX:
    //   return(
    //     <FormGroup row>
    //     <Col md="3">
    //       <Label htmlFor={`lvtCustomField_` + customField.idfieldcastp}>{customField.value}</Label>
    //     </Col>
    //     <Col md="9">
    //       <Input
    //         type="select" 
    //         name={`lvtCustomField_` + customField.idfieldcastp}
    //         id={`lvtCustomField_` + customField.idfieldcastp}
    //         idfieldcastp = {customField.idfieldcastp} >
    //         <option value="1">Option #1</option>
    //         <option value="2">Option #2</option>
    //         <option value="3">Option #3</option>
    //         <option value="4">Option #4</option>
    //         <option value="5">Option #5</option>
    //       </Input>
    //     </Col>
    //     </FormGroup>
    //   );
    //   break;

    case defines.CUSTOM_FIELD_TEXT:
      return(
        <FormGroup row>
          <Col md="3">
            <Label htmlFor={`lvtCustomField_` + customField.idfieldcastp}>{customField.value}</Label>
          </Col>
          <Col xs="12" md="9">
            <Input
              type="text"
              id={`lvtCustomField_` + customField.idfieldcastp}
              name={`lvtCustomField_` + customField.idfieldcastp}
              placeholder="Text"
              idfieldcastp = {customField.idfieldcastp} />
            <FormText color="muted">{customField.value}</FormText>
          </Col>
        </FormGroup>
      );
      break;
    
    default:
      return (null);
      break;
  }
}

class Create extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: {
        lvtDNI : '',
        lvtFirstname : '',
        lvtLastname : '',
        lvtEmail : '',
        lvtDateOfBirth : '',
        lvtCellphone : '',
        lvtPhone : '',
        lvtImages : '',
        lvtVideo : ''
      },
      loading: false,
      error: false,
      redirect: false,
      genders: [],
      customFields: [],
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
  }

  componentDidMount() {
    axios.get(
      defines.API_DOMAIN + '/gender'
    )
    .then( (response) => {
      if(response.status === 200 ) {
        this.setState({ genders: response.data.data })
      }else{
        throw new Error("Invalid status code");
      }
    })
    .catch( (err) => {
      console.log(err)
    });

    // fetch all API data
    const requestGender = axios.get( defines.API_DOMAIN + '/gender' );
    const requestCustomFields = axios.get( defines.API_DOMAIN + '/fieldcastp' );
    axios.all([requestGender, requestCustomFields]).then(axios.spread((...responses) => {
      const responseGender = responses[0];
      const responseCustomFields = responses[1];

      if(responseGender.status === 200 ) {
        this.setState({ genders: responseGender.data.data })
      }else{
        throw new Error("Invalid status code for responseGender");
      }

      if(responseCustomFields.status === 200 ) {
        this.setState({ customFields: responseCustomFields.data.data })
      }else{
        throw new Error("Invalid status code for responseCustomFields");
      }
    })).catch( (err) => {
      console.log(err);
    })
  }

  inputChangeHandler(e) {
    let formFields = {...this.state.formFields};
    formFields[e.target.name] = e.target.value;
    this.setState({ formFields });
  }

  handleSubmit(event) {
    event.preventDefault();
    
    const formcastp = this.state.customFields.filter(function(customField) {
      if( customField.idfieldtype !== defines.CUSTOM_FIELD_TEXTAREA && customField.idfieldtype !== defines.CUSTOM_FIELD_TEXT ){
        return false; // skip
      }
      return true;
    }).map(function(customField) { 
      return {
        idfieldcastp: customField.idfieldcastp,
        idfieldopcastp: '',
        value: event.target[`lvtCustomField_`+ customField.idfieldcastp].value
      }
    });
    
    const personData = {
      passport: this.state.formFields.lvtDNI,
      firstname: this.state.formFields.lvtFirstname,
      lastname: this.state.formFields.lvtLastname,
      email: this.state.formFields.lvtEmail,
      dob: this.state.formFields.lvtDateOfBirth,
      phone1: this.state.formFields.lvtCellphone,
      phone2: this.state.formFields.lvtPhone,
      gender: parseInt(event.target[`lvtGender`].value),
      // unused
      //images: this.state.formFields.lvtImages,
      //video: this.state.formFields.lvtVideo 
      // temporal
      createdby: 1,
      ruc: this.state.formFields.lvtDNI,
      formcastp: formcastp
    };

    this.setState({ loading: true });
    
    axios.post(defines.API_DOMAIN + '/person/', personData )
    .then( (response) => {
      if(response.status === 200 ) {
        this.setState({ loading: false, redirect: true });
      }else{
        throw new Error("Invalid status code");
      }
    })
    .catch( (err) => {
      console.log(err);
      this.setState({ loading: false, error: true });
    });
  }

  handleClickSubmit(event){
    event.preventDefault();
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
        <Row>
          <Col xs="12" md="12">
            <Card>
              <CardHeader>
                <strong>Registro</strong> Persona
              </CardHeader>
              <CardBody>
                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal" id="lvt-form-person" onSubmit={this.handleSubmit} >
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
                      <Label htmlFor="lvtFirstname">Nombre</Label>
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
                      <FormText color="muted">Primer nombre</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtLastname">Apellido</Label>
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
                      <FormText color="muted">Apellido paterno</FormText>
                    </Col>
                  </FormGroup>
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
                      <FormText color="muted">Teléfono fijo</FormText>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label>Género</Label>
                    </Col>
                    <Col md="9">
                      {gendersList.map((gender, index) =>
                        <GenderRadioOption key={index} gender={gender}/>
                      )}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtImages">Imágenes</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="lvtImages" name="lvtImages" multiple />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtVideo">Vídeo</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input type="file" id="lvtVideo" name="lvtVideo" />
                    </Col>
                  </FormGroup>
                  <hr />
                  {customFieldList.map((customField, index) =>
                    <CustomFieldsItems key={index} customField={customField}/>
                  )}

                  <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                </Form>
              </CardBody>
              <CardFooter>
                <Button type="submit" size="sm" color="primary" onClick={this.handleClickSubmit} ><i className="fa fa-dot-circle-o"></i> Submit</Button>
                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Create;
