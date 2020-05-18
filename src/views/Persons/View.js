import React, { Component } from 'react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem,
    Col,
    FormGroup,
    Label,
    Row,
    Table
} from 'reactstrap';
import { Redirect } from 'react-router'
import { Link, NavLink } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import { Player } from 'video-react';
import moment from 'moment';
import axios from 'axios';
import defines from '../../defines';
import labels from '../../labels';
import CustomModal from '../Notifications/Modals/CustomModal';

import 'react-image-gallery/styles/css/image-gallery.css'
import 'video-react/dist/video-react.css';

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            person: [],
            personImagesGallery: [],
            loading: true,
            error: false,
            redirect: false,
            modalVisible: false,
            modal: {
                modalType: '',
                modalTitle: '',
                modalBody: '',
                modalOkButton: '',
                modalCancelButton: '',
                okFunctionState: null,
                cancelFunctionState: this.cancelFunctionState
            }
        }
    }

    cancelFunctionState = () => {
        console.log('----handle cancel ----')
        this.setState({ modalVisible: false })
    }

    enableRedirect = () => {
        console.log('OK CLICKED'); this.setState({ redirect: true })
    }

    handleDelete = () => {
        // this.setState({ loading: true });
        console.log('----handle delete ----')
        this.setState({
            modalVisible: true,
            modal: {
                modalType: 'danger',
                modalBody: labels.LVT_WARNING_ELIMINAR_REGISTRO,
                modalTitle: labels.LVT_MODAL_DEFAULT_CONFIRMATION_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                modalCancelButton: labels.LVT_MODAL_DEFAULT_BUTTON_CANCEL,
                okFunctionState: this.deletePerson,
                cancelFunctionState: this.cancelFunctionState
            }
        });
    }

    deletePerson = () => {
        const deletePerson = axios.put(defines.API_DOMAIN + '/person/delete?module=' + defines.LVT_CASTING + "&id=" + this.props.match.params.id);
        axios.all([deletePerson]).then(axios.spread((...responses) => {
            const responseDeletePerson = responses[0];
            if (responseDeletePerson.status === 200) {
                this.setState({ modalVisible: false, loading: false });
                this.confirmPersonDeleted()
            } else {
                throw new Error(JSON.stringify({ status: responseDeletePerson.status, error: responseDeletePerson.data.data.msg }));
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

    confirmPersonDeleted = () => {
        console.log('--- confirm to redirect ----')
        this.setState({
            modalVisible: true,
            modal: {
                modalType: 'primary',
                modalBody: 'Registro borrado exitosamente',
                modalTitle: labels.LVT_MODAL_DEFAULT_TITLE,
                modalOkButton: labels.LVT_MODAL_DEFAULT_BUTTON_OK,
                okFunctionState: this.enableRedirect
            }
        });
    }

    componentDidMount() {
        this.setState({ loading: true });
        axios.get(
            defines.API_DOMAIN + '/person?module=' + defines.LVT_CASTING + "&id=" + this.props.match.params.id
        )
            .then((response) => {
                if (response.status === 200) {
                    let personData = response.data.data;
                    let personImagesGallery = personData.images.map(function (image) {
                        return {
                            original: image.optimized,
                            thumbnail: image.thumbnail,
                            originalAlt: "Image: " + image.idimage,
                            thumbnailAlt: "Image: " + image.idimage,
                            idimage: image.idimage
                        }
                    })




                    this.setState({
                        loading: false,
                        error: false,
                        person: personData,
                        personImagesGallery: personImagesGallery,
                    })
                } else {
                    throw new Error(JSON.stringify({ status: response.status, error: response.data.data.msg }));
                }
            })
            .catch((error) => {
                if (error.response) {
                    this.setState({
                        loading: false,
                        error: true,
                        errorCode: error.response.status,
                        errorMessage: error.response.data.data ? error.response.data.data.msg : '',
                    });
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
            });
    }

    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

    render() {
        const person = this.state.person;
        console.log("person");
        console.log(JSON.stringify(person));
        const personDefaultFields = person.defaultfields;
        const personCustomFields = person.customfield;
        const personImagesGallery = this.state.personImagesGallery;
        const personVideos = this.state.person.videos;

        if (this.state.redirect) {
            return <Redirect to='/person/list' />;
        }

        if (this.state.loading) {
            return (
                <div>
                    <p> Loading... </p>
                </div>
            )
        }

        if (this.state.error) {
            return (
                <div className="animated fadeIn">
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <p>
                                        {this.state.errorMessage}
                                    </p>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }

        if (this.state && !this.state.error && !this.state.loading) {
            return (
                <div className="animated fadeIn">
                    {
                        (this.state.modalVisible) ?
                            <CustomModal
                                modalType={this.state.modal.modalType}
                                modalTitle={this.state.modal.modalTitle}
                                modalBody={this.state.modal.modalBody}
                                labelOkButton={this.state.modal.modalOkButton}
                                labelCancelButton={this.state.modal.modalCancelButton}
                                okFunction={this.state.modal.okFunctionState}
                                cancelFunction={this.state.modal.cancelFunctionState}
                            />
                            : ''
                    }

                    <Row>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Información</strong> Datos personales
                                </CardHeader>
                                <CardBody>
                                    <dl className="row mb-1">
                                        <dt className="col-sm-3">Cédula</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.dni}
                                        </dd>

                                        <dt className="col-sm-3">Nombres</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.firstname}
                                        </dd>

                                        <dt className="col-sm-3">Apellidos</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.lastname}
                                        </dd>

                                        <dt className="col-sm-3">Fecha de nacimiento</dt>
                                        <dd className="col-sm-9">
                                            {moment(personDefaultFields.dob).format('YYYY-MM-DD')}
                                        </dd>

                                        <dt className="col-sm-3">Edad</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.age + ' ' + defines.LVT_AGE_UNIT + 's'}
                                        </dd>

                                        <dt className="col-sm-3">Género</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.gender}
                                        </dd>

                                        <dt className="col-sm-3">RUC</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.ruc}
                                        </dd>
                                    </dl>
                                </CardBody>
                            </Card>
                        </Col>

                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Otros</strong> Características adicionales
                                </CardHeader>
                                <CardBody>
                                    <dl className="row mb-1">
                                        <dt className="col-sm-3">Estatura</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.height + ` (${defines.LVT_DISTANCE_UNIT})`}
                                        </dd>

                                        <dt className="col-sm-3">Peso</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.weight + ` (${defines.LVT_WEIGHT_UNIT})`}
                                        </dd>
                                    </dl>
                                    {(personCustomFields || []).map((customFieldData, indexCustomField) =>
                                        <FormGroup row key={indexCustomField}>
                                            <Col md="3" className="text-truncate">
                                                <strong>{customFieldData.name}</strong>
                                            </Col>
                                            <Col xs="12" md="9">
                                                <span>
                                                    {
                                                        Array.prototype.map.call((customFieldData.options || [{'value':customFieldData.value}]), function (item) { 
                                                            return item.value; 
                                                        }) .join(", ").split('||').join(",")
                                                    }
                                                </span>
                                            </Col>
                                        </FormGroup>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Multimedia</strong> Imágenes
                                </CardHeader>
                                <CardBody>
                                    {(personImagesGallery.length > 0) ?
                                        <ImageGallery
                                            items={personImagesGallery}
                                            lazyLoad={true}
                                            useBrowserFullscreen={true}
                                            showPlayButton={false}
                                            autoPlay={false}
                                        />
                                        :
                                        <p className="form-control-static">No existen elementos</p>
                                    }
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Multimedia</strong> Vídeo
                                </CardHeader>
                                <CardBody>
                                    {(personVideos || []).map((itemVideo, index) =>
                                        <div className="border p-2 mb-3" key={index}>
                                            <Player>
                                                <source src={itemVideo.url} />
                                            </Player>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" md="6">
                            <Card>
                                <CardHeader>
                                    <strong>Contacto</strong> Datos de contacto
                                </CardHeader>
                                <CardBody>

                                    <dl className="row mb-1">
                                        <dt className="col-sm-3">Email</dt>
                                        <dd className="col-sm-9">
                                            <a href={`mailto:${personDefaultFields.email}`}>{personDefaultFields.email}</a>
                                        </dd>

                                        <dt className="col-sm-3">Celular</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.phone1}
                                        </dd>

                                        <dt className="col-sm-3">Teléfono</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.phone2}
                                        </dd>

                                        <dt className="col-sm-3">Dirección</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.address}
                                        </dd>

                                        {/* <dt className="col-sm-3">Ciudad</dt>
                                        <dd className="col-sm-9">
                                            {personDefaultFields.city}
                                        </dd>

                                        <dt className="col-sm-3">País</dt>
                                        <dd className="col-sm-9">
                                            <i className={'flag-icon flag-icon-' + personDefaultFields.countrycode + ' h4 mb-0'} title={personDefaultFields.countrycode} id={personDefaultFields.countrycode}></i>
                                        </dd> */}

                                        <dt className="col-sm-3">Observaciones</dt>
                                        <dd className="col-sm-9">
                                            {
                                                (personDefaultFields.observations === null || personDefaultFields.observations === '' || personDefaultFields.observations === undefined)
                                                    ?
                                                    '-'
                                                    : personDefaultFields.observations
                                            }
                                        </dd>
                                    </dl>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>


                    <Row>
                        <Col xs="12" md="12">
                            <Card>
                                <CardFooter>
                                    {/* <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} >
                                        <i className="fa fa-edit"></i> Editar
                                    </Button> */}
                                    <Link to={'/person/edit/' + this.props.match.params.id} className="btn btn-dark btn-sm" color="primary" >
                                        Editar
                                    </Link>{' '}
                                    <Button type="reset" size="sm" color="danger" onClick={this.handleDelete}>
                                        <i className="fa fa-trash"></i> Eliminar
                                    </Button>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}

export default View;
