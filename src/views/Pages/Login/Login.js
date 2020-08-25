import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row } from 'reactstrap';
import defines from '../../../defines'
import defaultimg from '../../../assets/img/levector.jpg';
import logo from '../../../assets/img/brand/levector-logo.svg'
import axios from 'axios';
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: {
        lvtEmail: '',
        lvtPassword: ''
      },
      loading: false,
      error: false,
      redirect: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount(){
    let now = (new Date()).getTime()
    let lvt_session = localStorage.getItem('lvt');
    if(lvt_session){
      lvt_session = JSON.parse(lvt_session);
        let time_diff = now-lvt_session.created;
        if( time_diff < 3600000){
          this.setState({ redirect: true })
        }else{
          localStorage.removeItem('lvt');
        }
    }
  }

  inputChangeHandler(e) {
    let formFields = { ...this.state.formFields };
    formFields[e.target.name] = e.target.value;
    this.setState({
      formFields: formFields
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const loginData = {
      email: this.state.formFields.lvtEmail,
      password: this.state.formFields.lvtPassword,
    }
    this.setState({ loading: true });

    if (loginData.email !== '' && loginData.password !== ''){
      axios.post(
        defines.API_DOMAIN + '/user/login',
        loginData
      )
        .then((response) => {
          if(response.status === 200 ) {
            response.data.data[0].created = (new Date()).getTime();
            localStorage.setItem('lvt', JSON.stringify(response.data.data[0]));
            this.setState({loading: false,redirect: true})
          }else{
            // throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
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
          this.setState({ loading: false, redirect: false });
        });
    }else{
      return null;
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <p> Loading... </p>
        </div>
      )
    }
    if (this.state.redirect) {
      return <Redirect to='/dashboard/0' />;
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form id="lvt-form-login" onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Ingresa a tu cuenta</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-envelope-open"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Email"
                          autoComplete="email"
                          id="lvtEmail"
                          name="lvtEmail"
                          value={this.state.formFields.lvtEmail}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          id="lvtPassword"
                          name="lvtPassword"
                          value={this.state.formFields.lvtPassword}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="dark" className="px-4">Iniciar sesión</Button>
                        </Col>
                        {/* <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">Olvidé mi contraseña</Button>
                        </Col> */}
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white lvt-bg-gray2 py-5 d-md-down-none" style={{ width: '44%' }}>
                  <CardBody className="text-center">
                    <Row>
                      <Col md="12" className="text-center">
                        
                          <h2>Levector HER</h2>
                          <p>Plataforma para gestión interna de casting, locaciones y utilería dentro de Levector.</p>

                          <div className="text-center lvt-img-container lvt-card">
                            <img
                                src={ logo }
                                className="rounded img-responsive lvt-img"
                                alt="Levector HER"
                            />
                          
                          
                          {/* <Link to="/register">
                            <Button color="primary" className="mt-3" active tabIndex={-1}>Registrar!</Button>
                          </Link> */}

                          </div>
                        
                        
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
