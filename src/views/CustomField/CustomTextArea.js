import React, { Component } from 'react';
import defines from '../../defines'
import {
    Col,
    FormGroup,
    FormText,
    Input,
    Label,
  } from 'reactstrap';

class CustomTextArea extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onCustomFieldChange(e);
    }

    render(){
        const customFieldObj = this.props.customFieldObj;
        const customFieldValue = this.props.customFieldValue;
        let helpText = null;
        if( customFieldObj.helptext !== "" || customFieldObj.helptext !== null ){
            helpText = <FormText color="muted">{customFieldObj.helptext}</FormText>;
        }
        
        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>
                        {customFieldObj.fieldoption}
                    </Label>
                </Col>
                <Col xs="12" md="9">
                    <Input
                        type="textarea"
                        name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                        id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                        rows="3"
                        placeholder="..."
                        idfieldcastp = {customFieldObj.idfieldcastp}
                        value = {customFieldValue}
                        onChange = {this.handleChange}
                    />
                    {helpText}
                </Col>
            </FormGroup>
        );
    }
}

export default CustomTextArea;