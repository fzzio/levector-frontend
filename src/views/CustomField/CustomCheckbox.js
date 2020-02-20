import React, { Component } from 'react';
import defines from '../../defines'
import {
    Col,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';
import { parse } from 'react-filepond';

class CustomCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedIDs: []
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        let itemValue = e.target.value;
        let isChecked = e.target.checked;
        let checkedIDs = this.state.checkedIDs
        
        let indexItemValue = checkedIDs.indexOf( parseInt( itemValue ) );
        if(indexItemValue === -1){
            // the item does not exist, then if it is checked it is added
            if(isChecked){
                checkedIDs.push( parseInt( itemValue ) )
            }
        }else{
            // the item exists, then if it is not checked it is deleted
            if(!isChecked){
                checkedIDs.splice(indexItemValue, 1);
            }
        }
        checkedIDs.sort()
        this.setState({checkedIDs: checkedIDs})

        let pseudoEvent = {
            target : {
                name: e.target.name,
                value: this.state.checkedIDs.join(",")
            }
        }
        
        // Send value to parent function
        this.props.onCustomFieldChange(pseudoEvent);
    }

    componentWillReceiveProps(np){
        
        if(np.customFieldValue){
            let temp_custom_value = np.customFieldValue.split(',');
            temp_custom_value = temp_custom_value.map((t)=>{
                t = parseInt(t);
                return t;
            })
            console.log('--- checkbox: ',temp_custom_value )
            
            this.setState({checkedIDs:temp_custom_value})
        }
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
                    {(customFieldObj.values.length > 0) ?
                        customFieldObj.values.map((customOption, index) =>
                            <FormGroup check className="checkbox" key={index}>
                                <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={"lvtCustomCheckboxOption_" + customOption.idfieldopcastp}
                                    name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
                                    value={parseInt(customOption.idfieldopcastp)}
                                    checked={this.state.checkedIDs.indexOf( parseInt( customOption.idfieldopcastp ) ) > -1 ? true: false}
                                    onChange={(e) => this.handleChange.call(this, e)}
                                />
                                <Label check className="form-check-label" htmlFor={`lvtCustomCheckboxOption_` + customOption.idfieldopcastp}>
                                    {customOption.value.split('||').join(',')}
                                </Label>
                            </FormGroup>
                        )
                        :
                        <p className="form-control-static">No existen elementos</p>
                    }
                </Col>
            </FormGroup>
        );
    }
}

export default CustomCheckbox;