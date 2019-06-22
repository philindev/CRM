import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form} from "react-bootstrap";

export default class Create extends Component{
  constructor(props){
    super(props);
  }

  render(){
    let windowClient =
    <Modal
    show={this.props.showWindow}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Создать карточку клиента
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Заполните данные:</h5>
        <Form>
          <Form.Control type="text" placeholder="Ф.И.О." />
          <br />
          <Form.Control type="email" placeholder="Введите email" />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.props.onHide}>Сохранить</Button>
        <Button onClick={this.props.onHide}>Продолжить</Button>
        <Button onClick={this.props.onHide}>Отмена</Button>
      </Modal.Footer>
    </Modal>;

    return(windowClient);
  }
};
