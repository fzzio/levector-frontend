import React, { Component, lazy, Suspense } from 'react';
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
      limit: 2,
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
    const requestLastPersons = axios.get( defines.API_DOMAIN + '/person/' + this.state.limit + '/' + this.state.offset );
    axios.all([requestLastPersons]).then(axios.spread((...responses) => {
        const responseLastPersons = responses[0];
        if(responseLastPersons.status === 200 ) {
            this.setState({ persons: responseLastPersons.data.data })
        }else{
            throw new Error( JSON.stringify( {status: responseLastPersons.status, error: responseLastPersons.data.data.msg} ) );
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
    const personList = this.state.persons
    
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="4">
            <Widget02 header="123" mainText="Personas" icon="fa fa-users" color="primary" />
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Widget02 header="40" mainText="Locaciones" icon="fa fa-map-marker" color="info" />
          </Col>
          <Col xs="12" sm="6" lg="4">
            <Widget02 header="4321" mainText="Utilería" icon="fa fa-puzzle-piece" color="warning" />
          </Col>
        </Row>
        
        <Row>
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
                          <span className="ml-auto font-weight-bold">50%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="warning" value="50" />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-user-female progress-group-icon"></i>
                          <span className="title">Femenino</span>
                          <span className="ml-auto font-weight-bold">40%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="warning" value="40" />
                        </div>
                      </div>
                      <div className="progress-group mb-5">
                        <div className="progress-group-header">
                          <i className="icon-emotsmile progress-group-icon"></i>
                          <span className="title">Otros</span>
                          <span className="ml-auto font-weight-bold">10%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="warning" value="10" />
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
                          <th className="text-center"><i className="icon-people"></i></th>
                          <th>Persona</th>
                          <th className="text-center">Género</th>
                          <th className="text-center">País</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personList.map((person, index) =>
                          <tr key={index}>
                            <td className="text-center">
                              <div className="avatar">
                                <img src={(person.photo) ? defines.API_DOMAIN + defines.PERSON_PATH_IMG_THUMBNAIL + person.photo : defaultimg} className="img-avatar" alt={person.firstname + ' ' + person.lastname} />
                              </div>
                            </td>
                            <td>
                              <div>{person.firstname + ' ' + person.lastname}</div>
                              <div className="small text-muted">
                                <span>{person.age}</span> | <span>{person.height + ' ' + defines.LVT_HEIGHT_UNIT}</span> | <span>{person.weight + ' ' + defines.LVT_WEIGHT_UNIT}</span>
                              </div>
                            </td>
                            <td>
                              <div>{person.gender}</div>
                            </td>
                            <td className="text-center">
                              <i className={'flag-icon flag-icon-' + person.countrycode +' h4 mb-0'} title={person.countrycode} id={person.countrycode}></i>
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
          
        </Row>
      </div>
    );
  }
}

export default LevectorDashboard;
