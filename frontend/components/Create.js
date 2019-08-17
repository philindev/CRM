import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form, Dropdown,
  InputGroup, Col, Row, ButtonGroup} from "react-bootstrap";

export default class Create extends Component{
  constructor(props){
    super(props);
    this.state = {
      user: '',
      dateOfBirth: '',
      number: '',
      mail: '',
      firstParent: {},
      secondParent: {},
    };

    this.openContinue = this.openContinue.bind(this);
    this.sendProfile = this.sendProfile.bind(this);
  }

  // Закрывает и открывает окно заявки
  openContinue(){
    this.props.onHideCreate();
    this.props.onContinue();
  }

  sendProfile(whichWindow){
    let files = {
      user: this.state.user,
      dateOfBirth: this.state.dateOfBirth,
      number: this.state.number,
      mail: this.state.mail,
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
                  onChange={(e) => {this.setState({ user: e.target.value })}}
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


                <Form.Row>
                  {/* Почта и номер телефона ниже */}
                  <Form.Group as={Col} controlId="formGridEmail">
                    {/* Дата рождения ниже */}
                    <div class="well">
                      <div class="form-group">
                        <input type="date" class="form-control" id="exampleInputDOB1"
                        onChange={(e) => {this.setState({ dateOfBirth: e.target.value })}}
                        />
                      </div>
                    </div>
                  </Form.Group>


                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Control type="phone" placeholder="Номер телефона"
                    onChange={(e) => {this.setState({ number: e.target.value })}}
                    />
                  </Form.Group>
                </Form.Row>


                <Form.Control type="email" placeholder="Почта"
                  onChange={(e) => {this.setState({ mail: e.target.value })}}
                />


                <ButtonGroup aria-label="Basic example" className="mt-3">
                    <Button variant="danger" className="mr-3"
                    >Добавить родителя</Button>
                    <Button variant="success">Добавить поле</Button>
                </ButtonGroup>
          </Form>

          {(this.state.howManyParent) ?
            this.state.howManyParent.map((obj, ind) =>
                          <Form key={ind}>
                              <Form.Control className="mb-3" type="text" placeholder="Ф.И.О."/>
                              {/* Почта и номер телефона ниже */}
                              <Form.Control className="mb-3" type="phone" placeholder="Номер телефона"/>
                              <Form.Control className="mb-3" type="email" placeholder="Почта"/>
                              <Form.Control className="mb-3" type="text" placeholder="Место работы"/>
                          </Form>)
          : null}

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
