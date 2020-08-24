import React, { Component, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import Widget02 from '../Widgets/Widget02';
import defines from '../../defines'
import defaultimg from '../../assets/img/levector.jpg'
import moment from 'moment';


class LevectorDashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    console.log(this.props.match.params);

    this.state = {
      module: (this.props.match.params.module) ? parseInt(this.props.match.params.module) : -1,
      persons: [],
      props: [],
      vestry: [],
      locations: [],
      summaryPerson: null,
      summaryLocation: null,
      summaryVestry: null,
      summaryProps: null,
      limit: 3,
      offset: 0,
      dropdownOpen: false,
      radioSelected: 2,
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  componentDidMount() {
    const moduleCondition = (this.state.module) ? 'module=' + this.state.module : '';
    axios.get(defines.API_DOMAIN + '/summary?' + moduleCondition)
      .then((responseSummary) => {
        if(responseSummary.status === 200 ) {
          this.setState({
            summaryPerson: responseSummary.data.data.person || null,
            summaryProps: responseSummary.data.data.props || null,
            summaryLocation: responseSummary.data.data.location || null,
            summaryVestry: responseSummary.data.data.vestry || null,
          })
        }else{
          throw new Error( JSON.stringify( {status: responseSummary.status, error: responseSummary.data.data.msg} ) );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
    });

    // Person data
    axios.get( defines.API_DOMAIN + '/person?module=1&limit=' + this.state.limit + '&offset=' + this.state.offset )
      .then((responseLastPersons) => {
        if(responseLastPersons.status === 200 ) {
          this.setState({
            persons: responseLastPersons.data.data
          })
        }else{
          // throw new Error( JSON.stringify( {status: responseLastPersons.status, error: responseLastPersons.data.data.msg} ) );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
    });
    
    // Props data
    axios.get( defines.API_DOMAIN + '/prop?module=2&limit=' + this.state.limit + '&offset=' + this.state.offset )
      .then((responseLastPersons) => {
        if(responseLastPersons.status === 200 ) {
          this.setState({
            props: responseLastPersons.data.data
          })
        }else{
          console.log(responseLastPersons);
          // throw new Error( JSON.stringify( {status: responseLastPersons.status, error: responseLastPersons.data.data.msg} ) );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
    });

    // Vestry data
    axios.get( defines.API_DOMAIN + '/vestry?module=3&limit=' + this.state.limit + '&offset=' + this.state.offset )
      .then((responseLastVestry) => {
        if(responseLastVestry.status === 200 ) {
          this.setState({
            vestry: responseLastVestry.data.data
          })
        }else{
          // throw new Error( JSON.stringify( {status: responseLastVestry.status, error: responseLastVestry.data.data.msg} ) );
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
    });

    // Locations data
    axios.get( defines.API_DOMAIN + '/location?module=4&limit=' + this.state.limit + '&offset=' + this.state.offset )
      .then((responseLastLocations) => {
          if(responseLastLocations.status === 200 ) {
            this.setState({
              locations: responseLastLocations.data.data
            })
          }else{
            // throw new Error( JSON.stringify( {status: responseLastLocations.status, error: responseLastLocations.data.data.msg} ) );
          }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 404) {
            console.log(error.response.data.error);
          } else {
            console.log(error.response.data);
          }
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log('Error', error.message);
        }
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const personList = this.state.persons;
    const propsList = this.state.props;
    const vestryList = this.state.vestry;
    const locationList = this.state.locations;

    let summaryPerson = null
    if(this.state.summaryPerson !== null ){
      summaryPerson = {
        total: this.state.summaryPerson.total || 0,
        totalSegmented: {
          percentMale: (this.state.summaryPerson.totalSegmented === undefined) ? 0 : this.state.summaryPerson.totalSegmented.percentMale,
          percentFemale: (this.state.summaryPerson.totalSegmented === undefined) ? 0 : this.state.summaryPerson.totalSegmented.percentFemale,
          percentOthers: (this.state.summaryPerson.totalSegmented === undefined) ? 0 : this.state.summaryPerson.totalSegmented.percentOthers,
        }
      };
    }
    
    let summaryProps = null;
    if(this.state.summaryProps !== null ){
      summaryProps = {
        total: this.state.summaryProps.total || 0
      };
    }
    
    let summaryVestry = null;
    if(this.state.summaryVestry !== null ){
      summaryVestry = {
        total: this.state.summaryVestry.total || 0
      };
    }
    
    let summaryLocation = null;
    if(this.state.summaryLocation !== null ){
      summaryLocation = {
        total: this.state.summaryLocation.total || 0
      };
    }
    
    return (
      <div className="animated fadeIn">
        <Row>
          {
            (summaryPerson !== null) &&
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={summaryPerson.total + ""} mainText="Personas" icon="icon-people" color="primary" />
              </Col>
          }
          {
            (summaryLocation !== null) &&
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={summaryLocation.total + ""} mainText="Locaciones" icon="icon-location-pin" color="info" />
              </Col>
          }
          {
            (summaryProps !== null) &&
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={summaryProps.total + ""} mainText="Utilería" icon="icon-umbrella" color="warning" />
              </Col>
          }
          {
            (summaryVestry !== null) &&
              <Col xs="12" sm="6" lg="3">
                <Widget02 header={summaryVestry.total + ""} mainText="Vestuario" icon="icon-mustache" color="success" />
              </Col>
          }
        </Row>
        
        <Row>
          { (summaryPerson !== null) &&
            <Col xs="12" md="6" xl="6">
              <Card>
                <CardHeader>
                  <strong>Casting</strong>: Resumen
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" md="12" xl="12">
                      <ul>
                        <div className="progress-group">
                          <div className="progress-group-header">
                            <i className="icon-user progress-group-icon"></i>
                            <span className="title">Masculino</span>
                            <span className="ml-auto font-weight-bold">{parseInt(summaryPerson.totalSegmented.percentMale)} %</span>
                          </div>
                          <div className="progress-group-bars">
                            <Progress className="progress-xs" color="warning" value={parseFloat(summaryPerson.totalSegmented.percentMale).toFixed(2)} />
                          </div>
                        </div>
                        <div className="progress-group">
                          <div className="progress-group-header">
                            <i className="icon-user-female progress-group-icon"></i>
                            <span className="title">Femenino</span>
                            <span className="ml-auto font-weight-bold">{parseInt(summaryPerson.totalSegmented.percentFemale)} %</span>
                          </div>
                          <div className="progress-group-bars">
                            <Progress className="progress-xs" color="warning" value={parseFloat(summaryPerson.totalSegmented.percentFemale).toFixed(2)} />
                          </div>
                        </div>
                        <div className="progress-group mb-5">
                          <div className="progress-group-header">
                            <i className="icon-emotsmile progress-group-icon"></i>
                            <span className="title">Otros</span>
                            <span className="ml-auto font-weight-bold">{parseInt(summaryPerson.totalSegmented.percentOthers)} %</span>
                          </div>
                          <div className="progress-group-bars">
                            <Progress className="progress-xs" color="warning" value={parseFloat(summaryPerson.totalSegmented.percentOthers).toFixed(2)} />
                          </div>
                        </div>
                      </ul>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs="12" md="12" xl="12">
                      <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                        <thead className="thead-light">
                          <tr>
                            <td colSpan="3" className="text-center">
                              <h5>Últimos Ingresados</h5>
                            </td>
                          </tr>
                          <tr>
                            <th className="text-center"><i className="icon-people"></i></th>
                            <th>Persona</th>
                            <th className="text-center">Género</th>
                            {/* <th className="text-center">País</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {personList.map((person, index) =>
                            <tr key={index}>
                              <td className="text-center">
                                <Link to={ person.link } className=""  target="_blank" >
                                  <div className="avatar">
                                    <img src={(person.photo) ? person.photo : defaultimg} className="img-avatar" alt={person.firstname + ' ' + person.lastname} />
                                  </div>
                                </Link>
                              </td>
                              <td>
                                <div>
                                  <Link to={ person.link } className="lvt-link-1"  target="_blank" >
                                    {person.firstname + ' ' + person.lastname}
                                  </Link>
                                </div>
                                <div className="small text-muted">
                                  <span>{person.age}</span> | <span>{person.height + ' ' + defines.LVT_DISTANCE_UNIT}</span> | <span>{person.weight + ' ' + defines.LVT_WEIGHT_UNIT}</span>
                                </div>
                              </td>
                              <td>
                                <div>{person.gender}</div>
                              </td>
                              {/* <td className="text-center">
                                <i className={'flag-icon flag-icon-' + person.countrycode +' h4 mb-0'} title={person.countrycode} id={person.countrycode}></i>
                              </td> */}
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          }

          { (summaryProps !== null) &&
            <Col xs="12" md="6" xl="6">
              <Card>
                <CardHeader>
                  <strong>Utilería</strong>: Resumen
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" md="12" xl="12">
                      <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                        <thead className="thead-light">
                          <tr>
                            <td colSpan="3" className="text-center">
                              <h5>Últimos Ingresados</h5>
                            </td>
                          </tr>
                          <tr>
                            <th className="text-center"><i className="icon-umbrella"></i></th>
                            <th>Nombre</th>
                            <th className="text-center">Modificado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {propsList.map((props, index) =>
                            <tr key={index}>
                              <td className="text-center">
                                <Link to={ props.link } className=""  target="_blank" >
                                  <div className="avatar">
                                    <img src={(props.photo) ? props.photo : defaultimg} className="img-avatar" alt={props.name} />
                                  </div>
                                </Link>
                              </td>
                              <td>
                                <div>
                                  <Link to={ props.link } className="lvt-link-1"  target="_blank" >
                                    {props.name}
                                  </Link>
                                </div>
                                <div className="small text-muted">
                                  <span>{props.width + 'x' + props.height + 'x' + props.length + ' ' + defines.LVT_DISTANCE_UNIT}</span> | <span>{props.weight + ' ' + defines.LVT_WEIGHT_UNIT}</span>
                                </div>
                                <div>
                                </div>
                              </td>
                              <td className="text-center">
                                <span>
                                  { moment(props.modified).format('YYYY-MM-DD') }
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          }

          { (summaryVestry !== null) &&
            <Col xs="12" md="6" xl="6">
              <Card>
                <CardHeader>
                  <strong>Vestuario</strong>: Resumen
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" md="12" xl="12">
                      <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                        <thead className="thead-light">
                          <tr>
                            <td colSpan="3" className="text-center">
                              <h5>Últimos Ingresados</h5>
                            </td>
                          </tr>
                          <tr>
                            <th className="text-center"><i className="icon-mustache"></i></th>
                            <th>Nombre</th>
                            <th className="text-center">Modificado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vestryList.map((vestry, index) =>
                            <tr key={index}>
                              <td className="text-center">
                                <Link to={ vestry.link } className=""  target="_blank" >
                                  <div className="avatar">
                                    <img src={(vestry.photo) ? vestry.photo : defaultimg} className="img-avatar" alt={vestry.name} />
                                  </div>
                                </Link>
                              </td>
                              <td>
                                <div>
                                  <Link to={ vestry.link } className="lvt-link-1"  target="_blank" >
                                    {vestry.name}
                                  </Link>
                                </div>
                              </td>
                              <td className="text-center">
                                <span>
                                  { moment(vestry.modified).format('YYYY-MM-DD') }
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          }

          { (summaryLocation !== null) &&
            <Col xs="12" md="6" xl="6">
              <Card>
                <CardHeader>
                  <strong>Locaciones</strong>: Resumen
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12" md="12" xl="12">
                      <Table hover responsive className="table-outline mb-0 d-none d-sm-table">
                        <thead className="thead-light">
                          <tr>
                            <td colSpan="3" className="text-center">
                              <h5>Últimos Ingresados</h5>
                            </td>
                          </tr>
                          <tr>
                            <th className="text-center"><i className="icon-location-pin"></i></th>
                            <th>Nombre</th>
                            <th className="text-center">Modificado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {locationList.map((location, index) =>
                            <tr key={index}>
                              <td className="text-center">
                                <Link to={ location.link } className=""  target="_blank" >
                                  <div className="avatar">
                                    <img src={(location.photo) ? location.photo : defaultimg} className="img-avatar" alt={location.name} />
                                  </div>
                                </Link>
                              </td>
                              <td>
                                <div>
                                  <Link to={ location.link } className="lvt-link-1"  target="_blank" >
                                    {location.name}
                                  </Link>
                                </div>
                              </td>
                              <td className="text-center">
                                <span>
                                  { moment(location.modified).format('YYYY-MM-DD') }
                                </span>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          }
          
        </Row>
      </div>
    );
  }
}

export default LevectorDashboard;
