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
import defines from '../../defines'

import 'react-image-gallery/styles/css/image-gallery.css'
import 'video-react/dist/video-react.css';

class View extends Component {
    constructor(props) {
        super(props)
        this.state = {
            person: '',
            personImagesGallery: [],
        }
    }

    componentDidMount() {
        // fetch all API data
        const requestPerson = axios.get( defines.API_DOMAIN + '/person/' + this.props.match.params.id );
        axios.all([requestPerson]).then(axios.spread((...responses) => {
            const responsePerson = responses[0];
            if(responsePerson.status === 200 ) {
                let personData = responsePerson.data.data[0]
                let personImagesGallery = personData.photo.map(function(photo) {
                    return {
                        original: defines.API_DOMAIN + defines.PERSON_PATH_IMG + '/' + photo.url,
                        thumbnail: defines.API_DOMAIN + defines.PERSON_PATH_IMG + '/' + photo.url,
                        originalAlt: personData.dni,
                    }
                })

                this.setState({ 
                    person: personData,
                    personImagesGallery: personImagesGallery,
                })
            }else{
                throw new Error( JSON.stringify( {status: responsePerson.status, error: responsePerson.data.data.msg} ) );
            }
        }))
        .catch( (error) => {
            if (error.response) { 
                console.log(error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
            }
        });
    }

    render() {
        const person = this.state.person
        const personImagesGallery = this.state.personImagesGallery

        return(
            <div className="animated fadeIn">
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
                                        {person.dni}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Nombres</dt>
                                    <dd className="col-sm-9">
                                        {person.firstname}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Apellidos</dt>
                                    <dd className="col-sm-9">
                                        {person.lastname}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Fecha de nacimiento</dt>
                                    <dd className="col-sm-9">
                                        {moment(person.dob).format('YYYY-MM-DD')}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Género</dt>
                                    <dd className="col-sm-9">
                                        {person.gender}
                                    </dd>
                                    
                                    <dt className="col-sm-3">RUC</dt>
                                    <dd className="col-sm-9">
                                        {person.ruc}
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
                                        {person.height + ` (${defines.LVT_HEIGHT_UNIT})`}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Peso</dt>
                                    <dd className="col-sm-9">
                                        {person.weight + ` (${defines.LVT_WEIGHT_UNIT})`}
                                    </dd>
                                </dl>
                                {( person.customfields || []).map((customFieldData, index) =>
                                    <FormGroup row key = {index}>
                                        <Col md="3" className="text-truncate">
                                            <strong>{customFieldData.name}</strong>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <span id="" className="">
                                                {customFieldData.value}
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
                                {( person.videos || []).map((itemVideo, index) =>
                                    <Player key={index}>
                                        <source src={defines.API_DOMAIN + defines.PERSON_PATH_VID + '/' + itemVideo.url} />
                                    </Player>
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
                                        <a href={`mailto:${person.email}`}>{person.email}</a>
                                    </dd>
                                    
                                    <dt className="col-sm-3">Celular</dt>
                                    <dd className="col-sm-9">
                                        {person.phone1}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Teléfono</dt>
                                    <dd className="col-sm-9">
                                        {person.phone2}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Dirección</dt>
                                    <dd className="col-sm-9">
                                        {person.address}
                                    </dd>
                                    
                                    <dt className="col-sm-3">Observaciones</dt>
                                    <dd className="col-sm-9">
                                        {
                                            (person.observations === null || person.observations === '' || person.observations === undefined )
                                            ?
                                                '-'
                                            :   person.observations
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
                                <Button type="submit" size="sm" color="primary" onClick={this.handleSubmit} >
                                    <i className="fa fa-edit"></i> Editar
                                </Button>
                                <Button type="reset" size="sm" color="danger">
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

export default View;