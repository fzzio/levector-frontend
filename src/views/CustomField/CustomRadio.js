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
                id={"lvtCustomRadioOption_" + customOption.idfieldop}
                name={defines.CUSTOM_FIELD_PREFIX + props.customFieldID}
                value={parseInt(customOption.idfieldop)}
                checked={parseInt(customOption.idfieldop) === props.customOptionValue}
                onChange={props.onCustomOptionChange}
            />
            <Label className="form-check-label" check htmlFor={`lvtCustomRadioOption_` + customOption.idfieldop}>
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
        console.log('----- np.handleChange: ', e.target);
        this.setState({ 
            customOptionValue: customOptionValue 
        });
        this.props.onCustomFieldChange(e);
    }

    componentWillReceiveProps(np){
        
        if(np.customFieldValue){
            if( typeof np.customFieldValue == 'string' || typeof np.customFieldValue == 'number')
                this.setState({customOptionValue:parseInt(np.customFieldValue)})
            else if(typeof np.customFieldValue.length ){
                this.setState({customOptionValue:parseInt(np.customFieldValue[0].id)})
            }
        }
    }

    render(){
        const customFieldObj = this.props.customFieldObj;
        const errorFields = this.props.errorFields;

        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}>
                        {customFieldObj.field}
                    </Label>
                </Col>
                <Col md="9">
                    {customFieldObj.fieldoptions.map((customOption, index) =>
                        <CustomRadioOption 
                            key={index} 
                            customOption={customOption}
                            customOptionValue = {this.state.customOptionValue}
                            onCustomOptionChange = {(e) => this.handleChange.call(this, e)}
                            customFieldID = {customFieldObj.idfield}
                            errorFields = { errorFields }
                        />
                    )}
                </Col>
            </FormGroup>
        );
    }
}

export default CustomRadio;