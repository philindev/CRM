import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form, Dropdown,
  InputGroup, Col, Row, ButtonGroup} from "react-bootstrap";

export default class Parent extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      number: '',
      mail: '',
      job: '',
    }

    this.changeName = this.changeName.bind(this);
    this.changeNumber = this.changeNumber.bind(this);
    this.changeMail = this.changeMail.bind(this);
    this.changeJob = this.changeJob.bind(this);
    this.doIt = this.doIt.bind(this);
  }

  doIt(){
    let info = {
      name: this.state.name,
      number: this.state.number,
      mail: this.state.mail,
      job: this.state.job,
    }

    this.props.updateParent(info, this.props.which);
    console.log("Parent " + this.props.which + " work");
  }

  changeName(value){
    this.setState({name: value});
    this.doIt();
  }

  changeNumber(value){
    this.setState({number: value});
    this.doIt();
  }

  changeMail(value){
    this.setState({mail: value});
    this.doIt();
  }

  changeJob(value){
    this.setState({job: value});
    this.doIt();
  }



  render(){

    let parent =
          <Form className="ml-3 mt-3">
              <Form.Control className="mb-3" type="text" placeholder="Ф.И.О."
                    onChange={(e) => this.changeName(e.target.value)}
              />
              {/* Почта и номер телефона ниже */}
              <Form.Control className="mb-3" type="phone" placeholder="Номер телефона"
                      onChange={(e) => this.changeNumber(e.target.value)}
              />
              <Form.Control className="mb-3" type="email" placeholder="Почта"
                      onChange={(e) => this.changeMail(e.target.value)}
              />
              <Form.Control className="mb-2" type="text" placeholder="Место работы"
                      onChange={(e) => this.changeJob(e.target.value)}
              />
          </Form>;

    return(parent);
  }

}
