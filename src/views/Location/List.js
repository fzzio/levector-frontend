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
import LocationCard from './LocationCard';
import SearchForm from './SearchForm';


class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: [],
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

  handleResults = (locationResults) => {
    this.setState({ locations: [] });
    this.setState({ locations: locationResults });
  }

  updateActiveSearch = (locationSearchData)=>{
    this.setState({active_search:locationSearchData})
  }

  handleLoadMore = () => {

    let server_action = ''
    if(JSON.stringify(this.state.active_search).length>2){
      let locationSearchData = this.state.active_search;
      locationSearchData['offset'] = this.state.offset;
      server_action = axios.post(
          defines.API_DOMAIN + '/searchlocation/',
          locationSearchData
      )
    }else{
      server_action = axios.get(
        defines.API_DOMAIN + '/location?module=' + defines.LVT_CASTING + "&limit=" + this.state.limit + '&offset=' + this.state.offset
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
          

          let temp_locations = this.state.locations;
          this.setState({
            loading_more: false,
            error: false,
            locations: temp_locations.concat(data),
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
      defines.API_DOMAIN + '/location?module=' + defines.LVT_CASTING + "&limit=" + this.state.limit + '&offset=' + this.state.offset
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            error: false,
            locations: response.data.data,
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
    const locationList = this.state.locations;
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
          locationList={this.state.locations}
          handleResults={this.handleResults}
          updateActiveSearch = {this.updateActiveSearch}
        />
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Resultados <small className="text-muted"> Vestuarios registradas en la plataforma</small>
              </CardHeader>
              <CardBody>
                <Suspense fallback={this.loading()}>
                  <Row>
                    {(locationList.length > 0) ?
                      locationList.map((location, index) =>
                        <LocationCard key={index} location={location} />
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
