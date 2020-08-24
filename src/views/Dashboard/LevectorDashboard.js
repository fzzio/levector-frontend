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


class LevectorDashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
      persons: [],
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
    // fetch all API data
    const requestLastPersons = axios.get( defines.API_DOMAIN + '/person?module=1&limit=' + this.state.limit + '&offset=' + this.state.offset );
    const requestSummary = axios.get( defines.API_DOMAIN + '/summary/' );
    axios.all([requestLastPersons, requestSummary]).then(axios.spread((...responses) => {
        const responseLastPersons = responses[0];
        const responseSummary = responses[1];
        if(responseLastPersons.status === 200 ) {
            this.setState({
              persons: responseLastPersons.data.data
            })
        }else{
            throw new Error( JSON.stringify( {status: responseLastPersons.status, error: responseLastPersons.data.data.msg} ) );
        }

      if(responseSummary.status === 200 ) {
        this.setState({
          summaryPerson: responseSummary.data.data.person || null,
          summaryLocation: responseSummary.data.data.location || null,
          summaryVestry: responseSummary.data.data.vestry || null,
          summaryProps: responseSummary.data.data.props || null,
        })
      }else{
        throw new Error( JSON.stringify( {status: responseSummary.status, error: responseSummary.data.data.msg} ) );
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

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const personList = this.state.persons;

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
    
    let summaryLocation = null;
    if(this.state.summaryLocation !== null ){
      summaryLocation = {
        total: this.state.summaryLocation.total || 0
      };
    }

    let summaryVestry = null;
    if(this.state.summaryVestry !== null ){
      summaryVestry = {
        total: this.state.summaryVestry.total || 0
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
          <Col xs="12" md="6" xl="6">
          {
            (summaryPerson !== null) &&
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
          }
          </Col>
          
        </Row>
      </div>
    );
  }
}

export default LevectorDashboard;
