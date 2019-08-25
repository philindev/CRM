import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form, Dropdown,
  InputGroup, Col, Row, ButtonGroup} from "react-bootstrap";

export default class Parent extends Component{
  constructor(props){
    super(props);
  }

  render(){

    let first = (this.props.number > 0) ?
          <Form>
              <Form.Control className="mb-3" type="text" placeholder="Ф.И.О."/>
              {/* Почта и номер телефона ниже */}
              <Form.Control className="mb-3" type="phone" placeholder="Номер телефона"/>
              <Form.Control className="mb-3" type="email" placeholder="Почта"/>
              <Form.Control className="mb-3" type="text" placeholder="Место работы"/>
          </Form>
    : null;

    let second = (this.props.number > 1) ?
          <Form>
              <Form.Control className="mb-3" type="text" placeholder="Ф.И.О."/>
              {/* Почта и номер телефона ниже */}
              <Form.Control className="mb-3" type="phone" placeholder="Номер телефона"/>
              <Form.Control className="mb-3" type="email" placeholder="Почта"/>
              <Form.Control className="mb-3" type="text" placeholder="Место работы"/>
          </Form>
    : null;


    return(first, second)
  };
}
