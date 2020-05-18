import React, { Component, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
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
      loading_more: false,
      error: false,
      errorCode: 0,
      errorMessage: '',
      active_search:{}
    }

    this.handleResults = this.handleResults.bind(this);
  }

  handleResults = (personResults) => {
    this.setState({ persons: [] });
    this.setState({ persons: personResults });
  }

  updateActiveSearch = (personSearchData)=>{
    this.setState({active_search:personSearchData})
  }

  handleLoadMore = () => {

    let server_action = ''
    if(JSON.stringify(this.state.active_search).length>2){
      let personSearchData = this.state.active_search;
      personSearchData['offset'] = this.state.offset;
      server_action = axios.post(
          defines.API_DOMAIN + '/searchperson/',
          personSearchData
      )
    }else{
      server_action = axios.get(
        defines.API_DOMAIN + '/person?module=' + defines.LVT_CASTING + "&limit=" + this.state.limit + '&offset=' + this.state.offset
      )
    }

    this.setState({ loading_more: true });
    axios.all([server_action])
      .then((response) => {
        if (response[0].status === 200 || (response[0].data && response[0].data.sucess)) {
          let data = [];
          if(response[0].data){
            data=response[0].data.data;
          }else{
            data=response[0].data.data; 
          }
          

          let temp_persons = this.state.persons;
          this.setState({
            loading_more: false,
            error: false,
            persons: temp_persons.concat(data),
            offset: this.state.offset + data.length,
            // limit: this.state.offset + data.length
          })
        } else {
          throw new Error(JSON.stringify({ status: response[0].status, error: response[0].data.msg }));
        }
      })
      .catch((error) => {
        if (error.response) {
          this.setState({
            loading_more: false,
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

  

  componentDidMount() {
    this.setState({ loading: true });
    axios.get(
      defines.API_DOMAIN + '/person?module=' + defines.LVT_CASTING + "&limit=" + this.state.limit + '&offset=' + this.state.offset
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            error: false,
            persons: response.data.data,
            offset: this.state.offset + response.data.data.length
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
    const personList = this.state.persons;
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
    return (
      <div className="animated fadeIn">
        <SearchForm
          limit={this.state.limit}
          offset={this.state.offset}
          personList={this.state.persons}
          handleResults={this.handleResults}
          updateActiveSearch = {this.updateActiveSearch}
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
                    {(personList.length > 0) ?
                      personList.map((person, index) =>
                        <PersonCard key={index} person={person} />
                      )
                      :
                      <p className="form-control-static">No existen elementos</p>
                    }
                  </Row>
                </Suspense>
              </CardBody>
              {this.state.loading_more &&
                <div>
                  <p Style={'margin-Left:20px'}> Loading... </p>
                </div>}
              <CardFooter>
                <Row>
                  <Col md="12">
                    <Button color="dark" onClick={this.handleLoadMore}>
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
