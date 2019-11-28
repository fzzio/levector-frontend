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

class CustomText extends Component {
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

        let appendInput = null;
        let inputCustomText = <Input
                                type="text"
                                id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                                name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                                placeholder={customFieldValue}
                                idfieldcastp = {customFieldObj.idfieldcastp}
                                value = {customFieldValue}
                                onChange = {this.handleChange}
                            />;
        if( customFieldObj.appendtext !== "" && customFieldObj.appendtext !== null ){
            appendInput =    <InputGroup>
                                { inputCustomText }
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>{ customFieldObj.appendtext }</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
        }else{
            appendInput = inputCustomText
        }

        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>
                        {customFieldObj.fieldoption}
                    </Label>
                </Col>
                <Col xs="12" md="9">
                    {appendInput}
                    {helpText}
                </Col>
            </FormGroup>
        );
    }
}

export default CustomText;
