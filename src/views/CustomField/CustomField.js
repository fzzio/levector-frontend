import React, { Component } from 'react';
import defines from '../../defines'
import CustomText from './CustomText';
import CustomTextArea from './CustomTextArea';
import CustomSelect from './CustomSelect';
import CustomRadio from './CustomRadio';
import CustomCheckbox from './CustomCheckbox';

class CustomField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSearch: false,
            loading: true,
            error: false,
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({ 
            isSearch: this.props.isSearch,
        });
    }

    handleChange(e) {
        this.props.onCustomFieldChange(e);
    }
    componentWillReceiveProps(a,b){
        // console.log('==a:',a)
        
    }

    render(){
        const customFieldObj = this.props.customFieldObj;
        const customFieldValue = this.props.customFieldValue;
        const errorFields = this.props.errorFields;
        const isSearch = this.state.isSearch;

        switch (customFieldObj.idfieldtype) {
            case defines.CUSTOM_FIELD_TEXT:
                return(
                    <CustomText 
                        customFieldObj = { customFieldObj }
                        customFieldValue = { customFieldValue }
                        onCustomFieldChange = {this.handleChange}
                        errorFields = { errorFields }
                        isSearch = { isSearch }
                    />
                );
                break;
            
            case defines.CUSTOM_FIELD_TEXTAREA:
                if ( !isSearch ) {
                    return(
                        <CustomTextArea 
                            customFieldObj = { customFieldObj }
                            customFieldValue = { customFieldValue }
                            onCustomFieldChange = {this.handleChange}
                            errorFields = { errorFields }
                            isSearch = { isSearch }
                        />
                    );
                }else{
                    return(
                        <CustomText 
                            customFieldObj = { customFieldObj }
                            customFieldValue = { customFieldValue }
                            onCustomFieldChange = {this.handleChange}
                            errorFields = { errorFields }
                            isSearch = { isSearch }
                        />
                    );
                }
                break;
            
            case defines.CUSTOM_FIELD_COMBOBOX:
                if(!isSearch){
                    return(
                        <CustomSelect
                            customFieldObj = { customFieldObj }
                            customFieldValue = { customFieldValue }
                            onCustomFieldChange = {this.handleChange}
                            errorFields = { errorFields }
                            isSearch = { isSearch }
                        />
                    );
                }else{
                    return(
                        <CustomCheckbox
                            customFieldObj = { customFieldObj }
                            onCustomFieldChange = {this.handleChange}
                            errorFields = { errorFields }
                            isSearch = { isSearch }
                        />
                    );
                }
                break;
            
            case defines.CUSTOM_FIELD_RADIO:
                if(!isSearch){
                    return(
                        <CustomRadio
                            customFieldObj = { customFieldObj }
                            customFieldValue = { customFieldValue }
                            onCustomFieldChange = {this.handleChange}
                            errorFields = { errorFields }
                            isSearch = { isSearch }
                        />
                    );
                }else{
                    return(
                        <CustomCheckbox
                            customFieldObj = { customFieldObj }
                            onCustomFieldChange = {this.handleChange}
                            errorFields = { errorFields }
                            isSearch = { isSearch }
                        />
                    );
                }
                break;

            case defines.CUSTOM_FIELD_CHECKBOX:
                return(
                    <CustomCheckbox
                        customFieldObj = { customFieldObj }
                        onCustomFieldChange = {this.handleChange}
                        errorFields = { errorFields }
                        isSearch = { isSearch }
                    />
                );
                break;
            
            default:
                return (null);
            break;
        }
    }
}

export default CustomField;