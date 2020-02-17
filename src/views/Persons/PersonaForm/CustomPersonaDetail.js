import React, { Component } from 'react';
import { connect } from 'react-redux';
import defines from '../../../defines'

import CustomField from '../../CustomField/CustomField';
import { CardBody, Col, FormGroup, FormText, Input,   InputGroup, InputGroupAddon, InputGroupText, Label } from 'reactstrap';

class CustomPersonaDetail extends Component{

    constructor(props) {
        super(props);
        this.inputChangeHandler = this.inputChangeHandler.bind(this)
        this.inputRadioHandler = this.inputRadioHandler.bind(this)
        this.customInputChangeHandler = this.customInputChangeHandler.bind(this);
    }  

    inputChangeHandler(e){
        this.props.inputChangeHandler(e);
        this.setState({[e.target.name]:e.target.value});
    }
    
    customInputChangeHandler(e){
          this.props.inputChangeHandler(e);
          this.setState({[e.target.name]:e.target.value});
    }
    
    inputRadioHandler(e){
        this.props.inputRadioHandler(e)
        this.setState({[e.target.name]: parseInt(e.target.value)});
    }

    componentWillReceiveProps(a,b){
        // console.log('a:', a)
        // console.log('b:', b)
    }

    render(){
        console.log('this.props.customFieldList:', this.props.customFieldList)
        console.log('this.props.customFieldsData:', this.props.customFieldsData)

        return(
            <CardBody>
                <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="lvtHeight">Estatura</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <InputGroup>
                        <Input
                          type="number"
                          min={0}
                          id="lvtHeight"
                          name="lvtHeight"
                          placeholder="170"
                          value={this.props._persona.lvtHeight}
                          onChange={this.inputChangeHandler}
                          valid = { this.props.errorFields.valid.indexOf("lvtHeight") > -1 }
                          invalid = { this.props.errorFields.invalid.indexOf("lvtHeight") > -1 }
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
                          min={0}
                          placeholder="63"
                          value={this.props._persona.lvtWeight}
                          onChange={this.inputChangeHandler}
                          valid = { this.props.errorFields.valid.indexOf("lvtWeight") > -1 }
                          invalid = { this.props.errorFields.invalid.indexOf("lvtWeight") > -1 }
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
                  {( this.props.customFieldList || []).map((customFieldObj, index) =>
                    <CustomField 
                      key={index}
                      customFieldObj={customFieldObj}
                      customFieldValue = {this.props.customFieldsData[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp]}
                      onCustomFieldChange = {this.customInputChangeHandler}
                      errorFields = { this.props.errorFields }
                    />
                  )}
                </CardBody>
        )
    }
}

const mapStateToProps = state => {
    return{
      customfields: state.genderlist
    }
}
export default connect(mapStateToProps)(CustomPersonaDetail);