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

class CustomField extends Component {
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
        switch (customFieldObj.idfieldtype) {
            // case defines.CUSTOM_FIELD_CHECKBOX:
            //   return(
            //     <FormGroup row>
            //       <Col md="3"><Label>{customFieldObj.value}</Label></Col>
            //       <Col md="9">
            //         {/* { ( customFieldObj.hasOwnProperty('values') ) 
            //           ? customFieldObj.values.map((value, index) => {
            //               return (
            //                 <FormGroup check className="checkbox">
            //                   <Input
            //                     className="form-check-input"
            //                     type="checkbox"
            //                     id="checkbox1"
            //                     name="checkbox1"
            //                     value={value}
            //                     idfieldcastp = {customFieldObj.idfieldcastp}
            //                   />
            //                   <Label check className="form-check-label" htmlFor="checkbox1">Option 1</Label>
            //                 </FormGroup>
            //               )
            //             })
            //           : <Col xs="12" md="9">
            //             <p className="form-control-static">No existen opciones</p>
            //           </Col>
            //         } */}
            //           <FormGroup check className="checkbox">
            //             <Input
            //               className="form-check-input"
            //               type="checkbox"
            //               id="checkbox1"
            //               name="checkbox1"
            //             />
            //             <Label check className="form-check-label" htmlFor="checkbox1">Option 1</Label>
            //           </FormGroup>
            //       </Col>
            //     </FormGroup>
            //   );
            //   break;
    
        case defines.CUSTOM_FIELD_TEXTAREA:
            return(
                <FormGroup row>
                    <Col md="3">
                        <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>{customFieldObj.fieldoption}</Label>
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
            break;
    
            // case defines.CUSTOM_FIELD_LIST:
            //   return(
            //     <FormGroup row>
            //     <Col md="3">
            //       <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>{customFieldObj.value}</Label>
            //     </Col>
            //     <Col md="9">
            //       <Input
            //         type="select" 
            //         name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
            //         id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
            //         idfieldcastp = {customFieldObj.idfieldcastp}
            //         multiple >
            //         <option value="1">Option #1</option>
            //         <option value="2">Option #2</option>
            //         <option value="3">Option #3</option>
            //         <option value="4">Option #4</option>
            //         <option value="5">Option #5</option>
            //       </Input>
            //     </Col>
            //     </FormGroup>
            //   );
            //   break;
    
            // case defines.CUSTOM_FIELD_COMBOBOX:
            //   return(
            //     <FormGroup row>
            //     <Col md="3">
            //       <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>{customFieldObj.value}</Label>
            //     </Col>
            //     <Col md="9">
            //       <Input
            //         type="select" 
            //         name={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
            //         id={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}
            //         idfieldcastp = {customFieldObj.idfieldcastp} >
            //         <option value="1">Option #1</option>
            //         <option value="2">Option #2</option>
            //         <option value="3">Option #3</option>
            //         <option value="4">Option #4</option>
            //         <option value="5">Option #5</option>
            //       </Input>
            //     </Col>
            //     </FormGroup>
            //   );
            //   break;
    
        case defines.CUSTOM_FIELD_TEXT:
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
                    <Label htmlFor={defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp}>{customFieldObj.fieldoption}</Label>
                </Col>
                <Col xs="12" md="9">
                    {appendInput}
                    {helpText}
                </Col>
                </FormGroup>
            );
            break;
            
        default:
            return (null);
            break;
        }
    }
}

export default CustomField;