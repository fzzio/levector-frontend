import React, { Component, lazy, Suspense } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Badge,
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Progress,
  Row,
  Table,
} from 'reactstrap';
import Widget02 from '../Widgets/Widget02';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'


class LevectorDashboard extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = {
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

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

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
                          <th className="text-center">País</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="text-center">
                            <div className="avatar">
                              <img src={'assets/img/avatars/1.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                            </div>
                          </td>
                          <td>
                            <div>Andrea Cáceres</div>
                            <div className="small text-muted">
                              <span>30</span> | Femenino
                            </div>
                          </td>
                          <td className="text-center">
                            <i className="flag-icon flag-icon-ec h4 mb-0" title="ec" id="ec"></i>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-center">
                            <div className="avatar">
                              <img src={'assets/img/avatars/1.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />
                            </div>
                          </td>
                          <td>
                            <div>Fabricio Orrala</div>
                            <div className="small text-muted">
                              <span>31</span> | masculino
                            </div>
                          </td>
                          <td className="text-center">
                            <i className="flag-icon flag-icon-ec h4 mb-0" title="ec" id="ec"></i>
                          </td>
                        </tr>
                        
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
