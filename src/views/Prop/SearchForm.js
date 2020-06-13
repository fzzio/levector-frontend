import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col,
    Collapse,
    Form,
    FormGroup,
    Input,
    Label,
    Row,
} from 'reactstrap';
import moment from 'moment';
import defines from '../../defines'
import CustomField from '../CustomField/CustomField';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

// import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
// const Handle = Slider.Handle;

class SearchForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            formFields: {
                lvtId: '',
                lvtName: '',
            },
            lvtWidth: { min: defines.LVT_HEIGHT_MIN, max: defines.LVT_HEIGHT_MAX },
            lvtHeight: { min: defines.LVT_HEIGHT_MIN, max: defines.LVT_HEIGHT_MAX },
            lvtLength: { min: defines.LVT_HEIGHT_MIN, max: defines.LVT_HEIGHT_MAX },
            lvtWeight: { min: defines.LVT_WEIGHT_MIN, max: defines.LVT_WEIGHT_MAX },
            customFields: [],
            customFieldsData: [],
            loading: false,
            error: false,
            collapseSearchForm: false,
        }

        this.inputChangeHandler = this.inputChangeHandler.bind(this);
        this.customInputChangeHandler = this.customInputChangeHandler.bind(this);
        this.customInputRadioHandler = this.customInputRadioHandler.bind(this);
        this.rangeAgeChangeHandler = this.rangeAgeChangeHandler.bind(this);
        this.rangeHeightChangeHandler = this.rangeHeightChangeHandler.bind(this);
        this.rangeWeightChangeHandler = this.rangeWeightChangeHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleSearchForm = this.toggleSearchForm.bind(this);
    }

    toggleSearchForm() {
        this.setState({ collapseSearchForm: !this.state.collapseSearchForm });
    }

    componentDidMount() {
        // fetch all API data
        const requestCustomFields = axios.get(defines.API_DOMAIN + '/field?module=' + defines.LVT_PROPS);
        axios.all([requestCustomFields]).then(axios.spread((...responses) => {
            const responseCustomFields = responses[0];
            if (responseCustomFields.status === 200) {
                let customFieldElements = responseCustomFields.data.data.map((responseCustomField) => {
                    let customFieldElement = {
                        name: defines.CUSTOM_FIELD_PREFIX + responseCustomField.idfield,
                        value: '',
                        idfieldtype: responseCustomField.idfieldtype,
                        idfieldcastp: responseCustomField.idfield,
                    };
                    return customFieldElement;
                });

                this.setState({
                    customFields: responseCustomFields.data.data,
                    customFieldsData: customFieldElements
                });
            } else {
                throw new Error(JSON.stringify({ status: responseCustomFields.status, error: responseCustomFields.data.data.msg }));
            }
        }))
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });
    }

    inputChangeHandler(e) {
        let formFields = this.state.formFields;
        formFields[e.target.name] = e.target.value;
        this.setState({ formFields });
    }

    customInputRadioHandler(e) {
        let formFields = this.state.formFields;
        formFields[e.target.name] = parseInt(e.target.value);
        this.setState({ formFields });
    }

    customInputChangeHandler(e) {
        let customFieldsData = this.state.customFieldsData;
        const index = customFieldsData.findIndex(item => (item.name === e.target.name));
        if (index >= 0) {
            customFieldsData[index].value = e.target.value;
        }
        this.setState({ customFieldsData });
    }

    rangeAgeChangeHandler(e) {
        this.setState({ lvtAge: { min: e[0], max: e[1] } })
    }
    rangeHeightChangeHandler(e) {
        this.setState({ lvtHeight: { min: e[0], max: e[1] } })
    }
    rangeWeightChangeHandler(e) {
        this.setState({ lvtWeight: { min: e[0], max: e[1] } })
    }

    handleSubmit(event) {
        event.preventDefault();

        // Get data from Custom field
        let formcastp = this.state.customFieldsData.filter(function (customFieldData) {
            if (customFieldData.value === null || customFieldData.value === undefined || customFieldData.value === '') {
                return false; // skip
            }
            return true;
        }).map(function (customFieldData) {
            return {
                idfieldcastp: customFieldData.idfieldcastp,
                value: customFieldData.value,
                idfieldtype: customFieldData.idfieldtype,
            }
        })

        // Setting data to request
        const propSearchData = {
            idprop: this.state.formFields.lvtId,
            name: this.state.formFields.lvtName,
            minWidth: this.state.lvtWidth.min,
            maxWidth: this.state.lvtWidth.max,
            minHeight: this.state.lvtHeight.min,
            maxHeight: this.state.lvtHeight.max,
            minLength: this.state.lvtLength.min,
            maxLength: this.state.lvtLength.max,
            minWeight: this.state.lvtWeight.min,
            maxWeight: this.state.lvtWeight.max,
            formcastp: formcastp,
            limit: this.props.limit,
            offset: 0,
        };

        console.log("-- propSearchData --");
        console.log(JSON.stringify(propSearchData));

        this.setState({ loading: true });
        axios.post(
            defines.API_DOMAIN + '/prop/search/',
            propSearchData
        )
            .then((response) => {
                if (response.status === 200) {
                    this.setState({
                        loading: false,
                    });
                    this.props.handleResults(response.data.data);
                    this.props.updateActiveSearch(propSearchData);
                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 404) {
                        this.props.handleResults([]);
                        console.log(error.response.data.error);
                    } else {
                        console.log(error.response.data);
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                this.setState({ loading: false, error: true });
            });
    }

    render() {
        const customFieldList = this.state.customFields.filter(function (customFieldObj) {
            if (customFieldObj.idfieldtype === defines.CUSTOM_FIELD_TEXT || customFieldObj.idfieldtype === defines.CUSTOM_FIELD_TEXTAREA) {
                return false; // skip
            }
            return true;
        });
        return (
            <Row>
                <Col xl={12}>
                    <Form action="" method="post" className="form-horizontal" id="lvt-form-search" >
                        <Card>
                            <CardHeader>
                                <i className="fa fa-search"></i> Búsqueda <small className="text-muted"> Filtros de selección</small>
                                <div className="card-header-actions">
                                    <Button color="link" className="card-header-action btn-minimize" data-target="#collapseSearch" onClick={this.toggleSearchForm}>
                                        <i className="icon-arrow-down"></i>
                                    </Button>
                                </div>
                            </CardHeader>
                            <Collapse isOpen={this.state.collapseSearchForm} id="collapseSearch">
                                <CardBody>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label htmlFor="lvtId">Código</Label>
                                                </Col>
                                                <Col xs="12" md="9">
                                                    <Input
                                                        type="text"
                                                        id="lvtId"
                                                        name="lvtId"
                                                        placeholder="1234"
                                                        autoComplete="nope"
                                                        value={this.state.formFields.lvtId}
                                                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label htmlFor="lvtName">Nombres</Label>
                                                </Col>
                                                <Col xs="12" md="9">
                                                    <Input
                                                        type="text"
                                                        id="lvtName"
                                                        name="lvtName"
                                                        placeholder="Juan"
                                                        value={this.state.formFields.lvtName}
                                                        onChange={(e) => this.inputChangeHandler.call(this, e)}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>

                                        <Col md="4">
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Ancho</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_WIDTH_MIN}
                                                        max={defines.LVT_WIDTH_MAX}
                                                        defaultValue={[0, 240]}
                                                        marks={{
                                                            0: defines.LVT_WIDTH_MIN,
                                                            240: defines.LVT_WIDTH_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_DISTANCE_UNIT}s`}
                                                        onChange={(e) => this.rangeAgeChangeHandler.call(this, e)}
                                                        allowCross={false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Alto</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_HEIGHT_MIN}
                                                        max={defines.LVT_HEIGHT_MAX}
                                                        defaultValue={[0, 240]}
                                                        marks={{
                                                            0: defines.LVT_HEIGHT_MIN,
                                                            240: defines.LVT_HEIGHT_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_DISTANCE_UNIT}`}
                                                        onChange={(e) => this.rangeHeightChangeHandler.call(this, e)}
                                                        allowCross={false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Largo</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_HEIGHT_MIN}
                                                        max={defines.LVT_HEIGHT_MAX}
                                                        defaultValue={[0, 240]}
                                                        marks={{
                                                            0: defines.LVT_HEIGHT_MIN,
                                                            240: defines.LVT_HEIGHT_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_DISTANCE_UNIT}`}
                                                        onChange={(e) => this.rangeHeightChangeHandler.call(this, e)}
                                                        allowCross={false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Col md="3">
                                                    <Label>Peso</Label>
                                                </Col>
                                                <Col md="9">
                                                    <Range
                                                        min={defines.LVT_WEIGHT_MIN}
                                                        max={defines.LVT_WEIGHT_MAX}
                                                        defaultValue={[0, 150]}
                                                        marks={{
                                                            0: defines.LVT_WEIGHT_MIN,
                                                            150: defines.LVT_WEIGHT_MAX,
                                                        }}
                                                        tipFormatter={value => `${value} ${defines.LVT_WEIGHT_UNIT}`}
                                                        onChange={(e) => this.rangeWeightChangeHandler.call(this, e)}
                                                        allowCross={false}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <hr />
                                        </Col>
                                    </Row>
                                    <Row>
                                        {(customFieldList.length > 0) ?
                                            customFieldList.map((customFieldObj, index) =>
                                                <Col md="4" key={index}>
                                                    <CustomField
                                                        customFieldObj={customFieldObj}
                                                        customFieldValue={this.state.customFieldsData[defines.CUSTOM_FIELD_PREFIX + customFieldObj.idfieldcastp]}
                                                        onCustomFieldChange={(e) => this.customInputChangeHandler.call(this, e)}
                                                        isSearch={true}
                                                    />
                                                </Col>
                                            )
                                            :
                                            <Col md="12">
                                                <p className="form-control-static">No existen elementos</p>
                                            </Col>
                                        }
                                    </Row>
                                </CardBody>
                            </Collapse>
                            <CardFooter>
                                <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} >
                                    <i className="fa fa-search"></i> Buscar
                                </Button>
                                {/* <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Limpiar</Button> */}
                            </CardFooter>
                        </Card>
                    </Form>
                </Col>
            </Row>
        );
    }
}

export default SearchForm;
