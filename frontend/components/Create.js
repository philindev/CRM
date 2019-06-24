import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form, Dropdown,
  InputGroup, Col, Row, ButtonGroup} from "react-bootstrap";

export default class Create extends Component{
  constructor(props){
    super(props);

    this.openContinue = this.openContinue.bind(this);
  }

  // Закрывает и открывает окно заявки
  openContinue(){
    this.props.onHideCreate();
    this.props.onContinue();
  }


  render(){
    let windowClient =
        <Modal
        show={this.props.showWindow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={this.props.onHideCreate}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Создать новую заявку
            </Modal.Title>
          </Modal.Header>
          {/* Окно разных форм */}
          <Modal.Body>
            <h5>Заполните данные:</h5>
            <Form>
              <InputGroup className="mb-3">
                <Form.Control
                  type="text" placeholder="Название программы"
                />
                    <InputGroup.Append>
                      {/* Статус заявки выпадающее меню */}
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        Статус заявки
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>V.I.P.</Dropdown.Item>
                          <Dropdown.Item href="#/action-2">Новый</Dropdown.Item>
                          <Dropdown.Item href="#/action-3">Повторный</Dropdown.Item>
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
                        <input type="date" class="form-control" id="exampleInputDOB1"/>
                      </div>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} controlId="formGridPassword">
                    <Form.Control type="phone" placeholder="Номер телефона" />
                  </Form.Group>
                </Form.Row>
                <Form.Control type="email" placeholder="Почта" />
                <ButtonGroup aria-label="Basic example" className="mt-3">
                    <Button variant="danger" className="mr-3">Добавить родителя</Button>
                    <Button variant="success">Добавить поле</Button>
                </ButtonGroup>
          </Form>

        </Modal.Body>
          {/* Кнопки для сохранения и выхода */}
          <Modal.Footer>
            <Button onClick={this.props.onHideCreate}
                    variant="outline-warning"
            >Сохранить</Button>
            <Button onClick={this.openContinue}
                    variant="outline-info"
            >Продолжить</Button>
          </Modal.Footer>
        </Modal>;

    return(windowClient);
  }
};
