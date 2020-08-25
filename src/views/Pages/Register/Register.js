import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  FormGroup,
  Label
} from 'reactstrap';

import defines from '../../../defines'
import defaultimg from '../../../assets/img/levector.jpg';
import logo from '../../../assets/img/brand/levector-logo.svg'
import axios from 'axios';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formFields: {
        lvtName: '',
        lvtUsername: '',
        lvtEmail: '',
        lvtPassword: '',
        lvtAccess:[]
      },
      loading: false,
      error: false,
      redirect: false
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChangeHandler = this.inputChangeHandler.bind(this);
  }

  componentDidMount(){
    localStorage.removeItem('lvt');
  }

  inputChangeHandler(e) {
    let formFields = { ...this.state.formFields };
    
    if(e.target.name == "lvtAccess" ){
        if(e.target.checked){
          formFields[e.target.name].push(e.target.value)
        }else{
          formFields[e.target.name] = formFields[e.target.name].filter((v,i)=>{
            return v!=e.target.value;
          })
        }
    } else {
      formFields[e.target.name] = e.target.value;
    }

    this.setState({
      formFields: formFields
    });

  }

  handleSubmit(event) {
    event.preventDefault();
    const registerData = {
      name: this.state.formFields.lvtName,
      username: this.state.formFields.lvtUsername,
      email: this.state.formFields.lvtEmail,
      password: this.state.formFields.lvtPassword,
      module_id: this.state.formFields.lvtAccess
    }
    console.log('submit : ', registerData)
    
    if (registerData.name !== '' && registerData.username !== '' && registerData.email !== '' && registerData.password !== ''){
      this.setState({ loading: true });
      axios.post(
        defines.API_DOMAIN + '/user',
        registerData
      )
        .then((response) => {
          if(response.status === 200 ) {
            this.setState({
              loading:false,
              redirect: true
            })
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
      return <Redirect to='/login' />;
    }
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form id="lvt-form-register" onSubmit={this.handleSubmit}>
                    <h1>Registrar</h1>
                    <p className="text-muted">Crear cuenta</p>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          type="text"
                          placeholder="Nombre"
                          autoComplete="name"
                          id="lvtName"
                          name="lvtName"
                          value={this.state.formFields.lvtName}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="cil-happy"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          type="text"
                          placeholder="Usuario"
                          autoComplete="username"
                          id="lvtUsername"
                          name="lvtUsername"
                          value={this.state.formFields.lvtUsername}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input 
                        type="text" placeholder="Email" 
                        autoComplete="email" 
                        name="lvtEmail"
                        value={this.state.formFields.lvtEmail}
                          onChange={(e) => this.inputChangeHandler.call(this, e)}/>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="cil-apps"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <FormGroup check>
                      <Col sm={{ size: 10 }}>
                        <Label check>
                          <Input type="checkbox" value="1" name="lvtAccess" onChange={(e) => this.inputChangeHandler.call(this, e)}/>{' '}
                          Casting
                        </Label> <br/>
                        <Label check>
                          <Input type="checkbox" value="2" name="lvtAccess" onChange={(e) => this.inputChangeHandler.call(this, e)}/>{' '}
                          Utilería
                        </Label> <br/>
                        <Label check>
                          <Input type="checkbox" value="3" name="lvtAccess" onChange={(e) => this.inputChangeHandler.call(this, e)}/>{' '}
                          Vestuario
                        </Label> <br/>
                        <Label check>
                          <Input type="checkbox" value="4" name="lvtAccess" onChange={(e) => this.inputChangeHandler.call(this, e)}/>{' '}
                          Locación
                        </Label> <br/>
                        </Col>
                      </FormGroup>
                    </InputGroup>
                    {/* <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="cil-contact"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="select"
                        name="lvtRol"
                        id="lvtRol">
                        <option value="0">Seleccione Rol</option>
                        <option value="1">Administrador</option>
                        <option value="2">Operativo</option>
                      </Input>
                    </InputGroup> */}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                          type="password"
                          placeholder="Contraseña"
                          autoComplete="new-password"
                          id="lvtPassword"
                          name="lvtPassword"
                          value={this.state.formFields.lvtPassword}
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
                          placeholder="Repetir contraseña"
                          autoComplete="new-password"
                          id="lvtConfirmPassword"
                          name="lvtConfirmPassword"
                          onChange={(e) => this.inputChangeHandler.call(this, e)}
                        />
                    </InputGroup>
                  </Form>
                </CardBody>
                <CardFooter className="p-4">
                  <Row>
                    <Col xs="12" sm="6">
                      <Button color="success" block onClick={this.handleSubmit}>Crear cuenta</Button>
                    </Col>
                    <Col xs="12" sm="6">
                      <Link to="/login" className="px-4 btn btn-dark btn-block">Iniciar sesión</Link>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Register;
