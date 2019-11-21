import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, CardBody, CardFooter, CardHeader, Col, Row, Table, Button} from 'reactstrap';
import axios from 'axios';
import defines from '../../defines'

function PersonItem(props) {
  const person = props.person
  const personLink = `/users/${person.idperson}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <Col xs="12" sm="4" md="3">
      <Card id={person.idperson.toString()}>
        <CardBody>
          <Row>
            <Col>
            </Col>
          </Row>
          <div className="avatar">
            <img src={'assets/img/avatars/1.jpg'} className="img-circle img-no-padding img-responsive" alt="admin@bootstrapmaster.com" />
          </div>
          <div className="text-center">
            {person.firstname} {person.lastname}
          </div>
        </CardBody>
        <CardFooter>
          <div className="small text-muted">
            <span>{person.idstatus}</span> | {person.created}
            <Link className="btn btn-primary" color="primary" size="xs" to={personLink}>
              Ver más
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Col>
  )
}

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
        throw new Error("Invalid status code");
      }
    })
    .catch( (err) => {
      console.log(err)
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
                    <PersonItem key={index} person={person}/>
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
