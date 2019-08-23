import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form, Dropdown,
  InputGroup, Col, Row, ButtonGroup} from "react-bootstrap";
import Parent from "./Parent.js";

export default class Create extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      dateOfBirth: '',
      number: '',
      mail: '',
      countParent: 0,
      firstParent: {},
      secondParent: {},
    };

    this.openContinue = this.openContinue.bind(this);
    this.sendProfile = this.sendProfile.bind(this);
    this.addParent = this.addParent.bind(this);
    this.updateParent = this.updateParent.bind(this);
  }

  // Закрывает и открывает окно заявки
  openContinue(){
    this.props.onHideCreate();
    this.props.onContinue();
  }

  sendProfile(whichWindow){
    let files = {
      name: this.state.name,
      dateOfBirth: this.state.dateOfBirth,
      number: this.state.number,
      mail: this.state.mail,
      firstParent: this.state.firstParent,
      secondParent: this.state.secondParent,
    }
    console.log(files);
    if(
        files.user != '' &&
        files.dateOfBirth != '' &&
        files.number != '' &&
        files.mail != ''
      )
    {
    fetch('/UserData',
        {
          method: 'post',
          headers: {
            'Content-Type':'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
          },
          body: JSON.stringify(files),
        })
        .then(
        function(response) {
          if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            if(response.status === 500){
                console.log("Status: 500")
            }
            return;
          }

          // Examine the text in the response
          response.json()
          .then(function(data) {
            console.log(data);
            return;
            });
        })
      }
      else{
        console.log("Not all positions were written!")
      }
    };

    addParent(){
      console.log(this.state.countParent);
      this.setState({countParent: (this.state.countParent == 2) ? 2
                                                 : this.state.countParent + 1});
    }

    updateParent(info, which){
      console.log(which);
      if(which){
        this.setState({secondParent: info});
      }
      else{
        this.setState({firstParent: info});
      console.log("Completely changed");

      }
    }


  render(){

    let windowClient =
        <Modal
        show={this.props.showWindow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        onHide={this.props.onHideCreate}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Создать новую заявку
            </Modal.Title>
          </Modal.Header>
          {/* Окно разных форм */}
          <Modal.Body style={{overflow: 'auto'}}>
            <h5>Заполните данные:</h5>
            <Form>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text" placeholder="Ф.И.О."
                  onChange={(e) => {this.setState({ name: e.target.value })}}
                />


                    <InputGroup.Append>
                      {/* Статус заявки выпадающее меню */}
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        Статус заявки
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>V.I.P.</Dropdown.Item>
                          <Dropdown.Item>Новый</Dropdown.Item>
                          <Dropdown.Item>Повторный</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                  </InputGroup.Append>
                </InputGroup>


                <Form.Row style={{marginBottom: '0px', paddingBottom: "0px"}}>
                  {/* Почта и номер телефона ниже */}
                  <Form.Group as={Col} controlId="formGridEmail" style={{marginBottom: '0px', paddingBottom: "0px"}}>
                    {/* Дата рождения ниже */}
                    <div class="well">
                      <div class="form-group">
                        <input type="date" class="form-control" id="exampleInputDOB1"
                        onChange={(e) => {this.setState({ dateOfBirth: e.target.value })}}
                        />
                      </div>
                    </div>
                  </Form.Group>


                  <Form.Group as={Col} controlId="formGridPassword" style={{marginBottom: '0px', paddingBottom: "0px"}}>
                    <Form.Control type="phone" placeholder="Номер телефона"
                    onChange={(e) => {this.setState({ number: e.target.value })}}
                    />
                  </Form.Group>
                </Form.Row>


                <Form.Control type="email" placeholder="Почта" className="mb-2"
                  onChange={(e) => {this.setState({ mail: e.target.value })}}
                />

                {(this.state.countParent > 0) ? <span>Заполните 1 родителя:</span> : null}
                {(this.state.countParent > 0) ? <Parent data={this.state.firstParent} which={0} updateParent={this.updateParent}/> : null}
                {(this.state.countParent > 1) ? <span>Заполните 2 родителя:</span> : null}
                {(this.state.countParent > 1) ? <Parent data={this.state.secondParent} which={1} updateParent={this.updateParent}/>: null}


                <ButtonGroup aria-label="Basic example" className="mt-3">
                    <Button variant="danger" className="mr-3"
                        onClick={this.addParent}
                    >Добавить родителя</Button>
                    <Button variant="success">Добавить поле</Button>
                </ButtonGroup>
          </Form>

        </Modal.Body>
          {/* Кнопки для сохранения и выхода */}
          <Modal.Footer>
            <Button onClick={this.sendProfile}
                    variant="outline-warning"
            >Сохранить</Button>
            <Button onClick={this.sendProfile}
                    variant="outline-info"
            >Продолжить</Button>
          </Modal.Footer>
        </Modal>;

    return(windowClient);
  }
};
