import React, { Component } from 'react';
import defines from '../../defines'
import {
    Col,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

class CustomSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customOptionValue: null
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        let customOptionValue = this.state.customOptionValue;
        customOptionValue = parseInt(e.target.value);
        this.setState({ 
            customOptionValue: customOptionValue 
        });
        this.props.onCustomFieldChange(e);
    }

    render(){
        const customFieldObj = this.props.customFieldObj;
        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>
                        {customFieldObj.fieldoption}
                    </Label>
                </Col>
                <Col md="9">
                    <Input
                        type="select" 
                        name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                        id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                        onChange = {(e) => this.handleChange.call(this, e)} >
                        <option value="">Seleccione</option>
                        {customFieldObj.values.map((customOption, index) =>
                            <option key={index} value = { parseInt(customOption.idfieldopcastp) }>
                                {customOption.value.split('||').join(',')}
                            </option>
                        )}
                    </Input>
                </Col>
            </FormGroup>
        );
    }
}

export default CustomSelect;