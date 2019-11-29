import React, { Component } from 'react';
import defines from '../../../defines'
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
import { isNull } from 'util';

function CustomRadioOption(props){
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

class CustomRadio extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onCustomFieldChange(e);
    }

    render(){
        const optionList = this.state.genders;
        return(
            <FormGroup row>
            <Col md="3">
              <Label>Género</Label>
            </Col>
            <Col md="9">
              {optionList.map((gender, index) =>
                <CustomRadioOption 
                  key={index} 
                  gender={gender}
                  genderValue = {this.state.formFields.lvtGender}
                  onGenderFieldChange = {(e) => this.customInputRadioHandler.call(this, e)}
                />
              )}
            </Col>
          </FormGroup>
        );
    }
}

export default CustomRadio;