import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Modal, Dropdown, Button, InputGroup,
  Form, Col, Row, ButtonGroup} from "react-bootstrap";

export default class Continue extends Component{
  constructor(props){
    super(props);
  }
  render(){
    let modal = <Modal
    show={this.props.showWindow}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    onHide={this.props.onHideContinue}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Создать карточку клиента
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
                  {/* Статус клиента выпадающее меню */}
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    Статус заявки
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Заявка</Dropdown.Item>
                      <Dropdown.Item>Договор</Dropdown.Item>
                      <Dropdown.Item>Оплата</Dropdown.Item>
                      <Dropdown.Item>Вылет</Dropdown.Item>
                      <Dropdown.Item>Консультирование</Dropdown.Item>
                      <Dropdown.Item>Не заполнен</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </InputGroup.Append>
            </InputGroup>
            <Form.Row className="mb-0">
              <Form.Group as={Col} controlId="formGridText">
                {/* Дата отъезда ниже */}
                <div class="well">
                    <input type="date" class="form-control" id="exampleInputDOB1" placeholder="Дата отъезда"/>
                </div>
              </Form.Group>
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Control type="phone" placeholder="Год поездки" />
                </Form.Group>
            </Form.Row>
            <Form.Row className="mt-0">
                <Form.Group as={Col} controlId="formGridText">
                  <Form.Control type="text" placeholder="Страна" />
                </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Control type="text" placeholder="Источник заявки" />
              </Form.Group>
            </Form.Row>
            <Form.Control className="mb-3" type="text" placeholder="Группа / Индивидуально" />
            <Form.Control as="textarea" type="text" placeholder="Комментарий" style={{minHeight: "50px"}}/>
      </Form>
    </Modal.Body>
      {/* Кнопки для сохранения и выхода */}
      <Modal.Footer>
        <Button onClick={this.props.onHideCreate}
                variant="outline-warning"
                centered
        >Сохранить</Button>
      </Modal.Footer>
    </Modal>;

    return(modal);
  }
}
