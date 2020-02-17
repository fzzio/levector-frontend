import React, { Component } from 'react';
import defines from '../../defines'
import {
    Col,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';

function CustomRadioOption(props){
    const customOption = props.customOption;
    const errorFields = props.errorFields;

    return(
        <FormGroup check className="radio">
            <Input
                className="form-check-input"
                type="radio"
                id={"lvtCustomRadioOption_" + customOption.idfieldopcastp}
                name={defines.CUSTOM_FIELD_PREFIX + props.customFieldID}
                value={parseInt(customOption.idfieldopcastp)}
                checked={parseInt(customOption.idfieldopcastp) === props.customOptionValue}
                onChange={props.onCustomOptionChange}
            />
            <Label className="form-check-label" check htmlFor={`lvtCustomRadioOption_` + customOption.idfieldopcastp}>
                {customOption.value.split('||').join(',')}
            </Label>
        </FormGroup>
    );
}

class CustomRadio extends Component {
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
        const errorFields = this.props.errorFields;

        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>
                        {customFieldObj.fieldoption}
                    </Label>
                </Col>
                <Col md="9">
                    {customFieldObj.values.map((customOption, index) =>
                        <CustomRadioOption 
                            key={index} 
                            customOption={customOption}
                            customOptionValue = {this.state.customOptionValue}
                            onCustomOptionChange = {(e) => this.handleChange.call(this, e)}
                            customFieldID = {customFieldObj.idfieldcastp}
                            errorFields = { errorFields }
                        />
                    )}
                </Col>
            </FormGroup>
        );
    }
}

export default CustomRadio;