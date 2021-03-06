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
            location: [],
            locationImagesGallery: [],
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
                okFunctionState: this.deleteLocation,
                cancelFunctionState: this.cancelFunctionState
            }
        });
    }

    deleteLocation = () => {
        const deleteLocation = axios.put(defines.API_DOMAIN + '/location/delete?module=' + defines.LVT_LOCATIONS + "&id=" + this.props.match.params.id);
        axios.all([deleteLocation]).then(axios.spread((...responses) => {
            const responseDeleteLocation = responses[0];
            if (responseDeleteLocation.status === 200) {
                this.setState({ modalVisible: false, loading: false });
                this.confirmLocationDeleted()
            } else {
                throw new Error(JSON.stringify({ status: responseDeleteLocation.status, error: responseDeleteLocation.data.data.msg }));
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

    confirmLocationDeleted = () => {
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
            defines.API_DOMAIN + '/location?module=' + defines.LVT_LOCATIONS + "&id=" + this.props.match.params.id
        )
            .then((response) => {
                if (response.status === 200) {
                    let locationData = response.data.data;
                    let locationImagesGallery = locationData.images.map(function (image) {
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
                        location: locationData,
                        locationImagesGallery: locationImagesGallery,
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
        const location = this.state.location;
        console.log("location");
        console.log(JSON.stringify(location));
        const locationDefaultFields = location.defaultfields;
        const locationCustomFields = location.customfield;
        const locationImagesGallery = this.state.locationImagesGallery;
        const locationVideos = this.state.location.videos;

        if (this.state.redirect) {
            return <Redirect to='/location/list' />;
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
                                    <strong>Información</strong> Locacion
                                </CardHeader>
                                <CardBody>
                                    <dl className="row mb-1">
                                        <dt className="col-sm-3">Nombre</dt>
                                        <dd className="col-sm-9">
                                            {locationDefaultFields.name}
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
                                    {(locationCustomFields || []).map((customFieldData, indexCustomField) =>
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
                                    {(locationImagesGallery.length > 0) ?
                                        <ImageGallery
                                            items={locationImagesGallery}
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
                                    {(locationVideos || []).map((itemVideo, index) =>
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
                                    <strong>Otros</strong> Datos
                                </CardHeader>
                                <CardBody>
                                    <dl className="row mb-1">
                                        <dt className="col-sm-3">Observaciones</dt>
                                        <dd className="col-sm-9">
                                            {
                                                (locationDefaultFields.observations === null || locationDefaultFields.observations === '' || locationDefaultFields.observations === undefined)
                                                    ?
                                                    '-'
                                                    : locationDefaultFields.observations
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
                                    <Link to={'/location/edit/' + this.props.match.params.id} className="btn btn-dark btn-sm" color="primary" >
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
