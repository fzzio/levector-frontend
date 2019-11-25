import React, { Component, useState } from 'react';
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
const people = [
  "Siri",
  "Alexa",
  "Google",
  "Facebook",
  "Twitter",
  "Linkedin",
  "Sinkedin"
];


function Search(props) {
  const person = props.person
  const [firstname, setName] = useState('')
  const [lastname, setLastname] = useState('')
  const [skill, setSkill] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const submit = e => {
    e.preventDefault()
    fetch(`http://localhost:3000/searchperson/`, {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname }),
      /**aqui van mas campos */
    })
  }
  return (

    <Col xs="12" sm="12" md="12">
      <form onSubmit={submit}>
        <Col lg="3" sm="6" md="6">
          <label htmlFor="firstname">Name</label>
          <input class="form-control"
            name="firstname" placeholder="Juan"
            value={firstname}
            onChange={e => setName(e.target.value)}
          />
        </Col>
        <Col lg="3" sm="6" md="6">
          <label htmlFor="lastname">Lastname</label>
          <input class="form-control"
            name="lastname" placeholder="Lomas"
            value={lastname}
            onChange={e => setLastname(e.target.value)}
          />
        </Col>
        <Col lg="3" sm="6" md="6">
          <label htmlFor="skill">Aptitudes</label>
          <input class="form-control" 
            name="skill" placeholder="Actuar, bailar..."
            value={skill}
            onChange={e => setSkill(e.target.value)}
          />
        </Col>
        <Col lg="2" sm="3" md="3">
          <label htmlFor="weight">Peso</label>
          <input class="form-control"
            name="weight" placeholder="x Kg"
            value={weight}
            onChange={e => setWeight(e.target.value)}
          />
        </Col>
        <Col lg="2" sm="3" md="3">
          <label htmlFor="height">Altura</label>
          <input class="form-control"
            name="height" placeholder="y Cm"
            value={height}
            onChange={e => setHeight(e.target.value)}
          />
        </Col>
          <Col md="3">
            <Label htmlFor="address">Dirección</Label>
          </Col>
          <Col xs="9" md="7">
            <Input
              type="textarea"
              name="address"
              id="address"
              rows="3"
              placeholder="Urdesa Central, Cedros 215 y Victor Emilio Estrada"
            />
          </Col>
        <hr></hr>
        
        <Col xs="12" md="6">
          <Card>
            <CardHeader>
              <strong>Otros</strong> Datos adicionales
                </CardHeader>
            <CardBody>
            </CardBody>
          </Card>
        </Col>
        <hr></hr>
        <Col lg="3" sm="6" md="6">
        <button type="submit">Send it!</button>
        </Col>
      </form>
     
    </Col >
    


  )
}


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

      <Card id={person.ID}>
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
      .then((response) => {
        if (response.status === 200) {
          this.setState({ persons: response.data.data })
        } else {
          throw new Error("Invalid status code");
        }
      })
      .catch((err) => {
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
                  <Search />
                </Row>
                <Row>
                  {personList.map((person, index) =>
                    <PersonItem key={index} person={person} />
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
