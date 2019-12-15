import React, { Component, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupButtonDropdown,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import axios from 'axios';
import defines from '../../defines'
import PersonCard from './PersonCard/PersonCard';
import SearchForm from './SearchForm/SearchForm';


class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [],
      limit: 8,
      offset: 0,
      loading: true,
      error: false,
      errorCode: 0,
      errorMessage: '',
    }

    this.handleResults = this.handleResults.bind(this);
  }

  handleResults = (personResults) => {
    this.setState({persons: personResults})
  }

  componentDidMount() {
    axios.get(
      defines.API_DOMAIN + '/person/' + this.state.limit + '/' + this.state.offset
    )
    .then( (response) => {
      if(response.status === 200 ) {
        this.setState({ 
          error: false,
          persons: response.data.data,
        })
      }else{
        throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
      }
    })
    .catch( (error) => {
      if (error.response) {
        this.setState({ 
          error: true,
          errorCode: error.response.status,
          errorMessage: error.response.data.data.msg,
        });
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
    if (this.state.error) {
      return(
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
    return (
      <div className="animated fadeIn">
        <SearchForm 
          limit = {this.state.limit}
          offset = {this.state.offset}
          personList = {this.state.persons}
          handleResults = { this.handleResults }
        />
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Resultados <small className="text-muted"> Personas registradas en la plataforma</small>
              </CardHeader>
              <CardBody>
                <Suspense fallback={this.loading()}>
                  <Row>
                    {personList.map((person, index) =>
                      <PersonCard key={index} person={person}/>
                    )}
                  </Row>
                </Suspense>
              </CardBody>
              <CardFooter>
                <Row>
                  <Col md="12">
                    <Button color="dark">
                      Cargar más
                    </Button>
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default List;
