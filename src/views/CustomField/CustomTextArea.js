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
        const errorFields = this.props.errorFields;
        let helpText = null;
        if( customFieldObj.helptext !== "" || customFieldObj.helptext !== null ){
            helpText = <FormText color="muted">{customFieldObj.helptext}</FormText>;
        }
        
        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}>
                        {customFieldObj.field}
                    </Label>
                </Col>
                <Col xs="12" md="9">
                    <Input
                        type="textarea"
                        name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}
                        id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}
                        rows="3"
                        placeholder="..."
                        idfield = {customFieldObj.idfield}
                        value = {customFieldValue}
                        onChange = {this.handleChange}
                        autoComplete="nope"
                    />
                    {helpText}
                </Col>
            </FormGroup>
        );
    }
}

export default CustomTextArea;