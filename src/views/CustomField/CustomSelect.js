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
            customOptionValue: this.props.customFieldValue? parseInt(this.props.customFieldValue): ''
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

    componentWillReceiveProps(np){
        let value = '';
        if(np.customFieldValue){
            if( typeof np.customFieldValue  == 'object' ){
                value = np.customFieldValue[0].id;
            }else{
                value = np.customFieldValue;
            }
            if(value){
                value = parseInt(value);
            }   
            this.setState({customOptionValue:value})
            
        }
    }

    render(){
        const customFieldObj = this.props.customFieldObj;
        
        return(
            <FormGroup row>
                <Col md="3">
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}>
                        {customFieldObj.field}
                    </Label>
                </Col>
                <Col md="9">
                    <Input
                        type="select" 
                        name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}
                        id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfield}
                        onChange = {(e) => this.handleChange.call(this, e)} 
                        value = {this.state.customOptionValue}
                        >
                        <option value="">Seleccione</option>
                        {customFieldObj.fieldoptions.map((customOption, index) =>
                            <option key={index} value = { parseInt(customOption.idfieldop) }>
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