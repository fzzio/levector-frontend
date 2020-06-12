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
import PropCard from './PropCard';
import SearchForm from './SearchForm';


class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      propsObj: [],
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

  handleResults = (propResults) => {
    this.setState({ propsObj: [] });
    this.setState({ propsObj: propResults });
  }

  updateActiveSearch = (propSearchData)=>{
    this.setState({active_search:propSearchData})
  }

  handleLoadMore = () => {

    let server_action = ''
    if(JSON.stringify(this.state.active_search).length>2){
      let propSearchData = this.state.active_search;
      propSearchData['offset'] = this.state.offset;
      server_action = axios.post(
          defines.API_DOMAIN + '/searchprop/',
          propSearchData
      )
    }else{
      server_action = axios.get(
        defines.API_DOMAIN + '/prop?module=' + defines.LVT_PROPS + "&limit=" + this.state.limit + '&offset=' + this.state.offset
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

          let temp_props = this.state.propsObj;
          this.setState({
            loading_more: false,
            error: false,
            propsObj: temp_props.concat(data),
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
      defines.API_DOMAIN + '/prop?module=' + defines.LVT_PROPS + "&limit=" + this.state.limit + '&offset=' + this.state.offset
    )
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            error: false,
            propsObj: response.data.data,
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
    const propList = this.state.propsObj;
    console.log("--- propList ---");
    console.log(JSON.stringify(propList));
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
          propList={this.state.propsObj}
          handleResults={this.handleResults}
          updateActiveSearch = {this.updateActiveSearch}
        />
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Resultados <small className="text-muted"> Utilerías registradas en la plataforma</small>
              </CardHeader>
              <CardBody>
                <Suspense fallback={this.loading()}>
                  <Row>
                    {(propList.length > 0) ?
                      (propList || []).map((propObj, index) =>
                        <PropCard key={index} prop={propObj} />
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
