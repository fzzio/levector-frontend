import React, { Component } from 'react';
import defines from '../../defines'
import {
    Col,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

class CustomCheckbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customOptionValues: [],
            customFieldElements: [],
            checkedItems: new Map(),
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        const itemValue = e.target.value;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(itemValue, isChecked) }));         

        let optionIDs = []
        this.state.checkedItems.filter(function(value, key) {
            if( value === null || value === undefined || value === false ){
              return false; // skip
            }
            return true;
        }).forEach((element, index) => {
            optionIDs.push(index)
        });

        let pseudoEvent = {
            target : {
                name: e.target.name,
                value: optionIDs.join(",")
            }
        }
        this.props.onCustomFieldChange(pseudoEvent);
    }

    render(){
        const customFieldObj = this.props.customFieldObj;
        const customFieldValue = this.props.customFieldValue;

        console.log( customFieldValue )

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
                                    checked={this.state.checkedItems.get(customOption.name)}
                                    onChange={(e) => this.handleChange.call(this, e)}
                                />
                                <Label check className="form-check-label" htmlFor={`lvtCustomCheckboxOption_` + customOption.idfieldopcastp}>
                                    {customOption.value}
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