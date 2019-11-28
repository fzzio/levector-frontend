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
import PersonCard from './PersonCard/PersonCard';
import SearchForm from './SearchForm/SearchForm';


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
    let limit = 8
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
        <SearchForm />
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Resultados <small className="text-muted"> Personas registradas en la plataforma</small>
              </CardHeader>
              <CardBody>
                <Row>
                  {personList.map((person, index) =>
                    <PersonCard key={index} person={person}/>
                  )}
                </Row>
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
