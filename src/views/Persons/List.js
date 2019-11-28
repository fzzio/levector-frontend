import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardFooter, CardHeader, Col, Row, Table, Button} from 'reactstrap';
import axios from 'axios';
import defines from '../../defines'
import PersonCard from './PersonCard/PersonCard';
class List extends Component {
  constructor(props) {
    super(props)
      this.state = {
        persons: [],
        loading: true,
        error: false,
      }
  }

  componentDidMount() {
    let limit = 10
    let offset = 1
    axios.get(
      defines.API_DOMAIN + '/person/' + offset + '/' + limit
    )
    .then( (response) => {
      if(response.status === 200 ) {
        this.setState({ persons: response.data.data })
      }else{
        throw new Error( JSON.stringify( {status: response.status, error: response.data.data.msg} ) );
      }
    })
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

  render() {
    const personList = this.state.persons 

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Persons <small className="text-muted">example</small>
              </CardHeader>
              <CardBody>
                <Row>
                  {personList.map((person, index) =>
                    <PersonCard key={index} person={person}/>
                  )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default List;
