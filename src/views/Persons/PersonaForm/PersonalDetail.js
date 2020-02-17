import React, { Component } from 'react';
import { connect } from 'react-redux';

import { CardBody, Col, FormGroup, FormText, Input,   InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';
import {_getGenderList} from '../../../actions/utility';


class PersonalDetail extends Component{

    constructor(props) {
        super(props);
        this.inputChangeHandler = this.inputChangeHandler.bind(this)
        this.inputRadioHandler = this.inputRadioHandler.bind(this)
    }    
    // state={ lvtDNI:'', lvtFirstname:'', lvtLastname:'', lvtDateOfBirth:'', lvtGender:'', lvtRUC:'' }
    
    inputChangeHandler(e){
      this.props.inputChangeHandler(e);
      this.setState({[e.target.name]:e.target.value});
    }

    inputRadioHandler(e){
      this.props.inputRadioHandler(e)
      this.setState({[e.target.name]: parseInt(e.target.value)});
    }
    
    componentDidMount(){
      _getGenderList(this.props.dispatch);
    }

    render(){
        return(
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
                        value={this.props._persona.lvtDNI}
                        onChange={this.inputChangeHandler}
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
                        value={this.props._persona.lvtFirstname}
                        onChange={this.inputChangeHandler}
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
                        value={this.props._persona.lvtLastname}
                        onChange={this.inputChangeHandler}
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
                          value={this.props._persona.lvtDateOfBirth}
                          onChange={this.inputChangeHandler}
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md="3">
                      <Label>Género</Label>
                    </Col>
                    <Col md="9">
                      {this.props.genderlist.map((gender, index) =>
                        <GenderRadioOption 
                          key={index} 
                          gender={gender}
                          genderValue = {this.props._persona.lvtGender}
                          onGenderFieldChange = {this.inputRadioHandler}
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
                        value={this.props._persona.lvtRUC}
                        onChange={this.inputChangeHandler}
                      />
                      <FormText color="muted">Dato para facturación</FormText>
                    </Col>
                  </FormGroup>
                </CardBody>
        )
    }
}

const mapStateToProps = state => {
    return{
      genderlist: state.genderlist
    }
}  

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
export default connect(mapStateToProps)(PersonalDetail);