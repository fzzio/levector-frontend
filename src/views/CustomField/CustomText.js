import React, { Component } from 'react';
import defines from '../../defines'
import {
    Col,
    FormGroup,
    FormText,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Label,
} from 'reactstrap';

class CustomText extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onCustomFieldChange(e);
    }

    render() {
        const customFieldObj = this.props.customFieldObj;
        const customFieldValue = this.props.customFieldValue;
        const errorFields = this.props.errorFields;
        const isSearch = this.props.isSearch;
        let helpText = null;
        if (customFieldObj.helptext !== "" || customFieldObj.helptext !== null) {
            helpText = <FormText color="muted">{customFieldObj.helptext}</FormText>;
        }

        let appendInput = null;
        let inputCustomText = <Input
            type="text"
            id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}
            name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}
            placeholder={customFieldValue}
            idfield={customFieldObj.idfield}
            value={customFieldValue}
            onChange={(e) => this.handleChange.call(this, e)}
            autoComplete="nope"
        />;
        if (customFieldObj.appendtext !== "" && customFieldObj.appendtext !== null && !isSearch) {
            appendInput = <InputGroup>
                {inputCustomText}
                <InputGroupAddon addonType="append">
                    <InputGroupText>{customFieldObj.appendtext}</InputGroupText>
                </InputGroupAddon>
            </InputGroup>
        } else {
            appendInput = inputCustomText
        }

        return (
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}>
                        {customFieldObj.field}
                    </Label>
                </Col>
                <Col xs="12" md="9">
                    {appendInput}
                    {
                        (!isSearch)
                            ? helpText
                            : ''
                    }
                </Col>
            </FormGroup>
        );
    }
}

export default CustomText;
