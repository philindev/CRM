import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Modal, Dropdown, Button, InputGroup,
  Form, Col, Row, ButtonGroup} from "react-bootstrap";

export default class Continue extends Component{
  constructor(props){
    super(props);
    this.state = {
      status: 'Статус заявки',
      country: '',
      name_of_program: '',
      year_of_fly: '',
      where_from: '',
      data_of_will_fly: '',
      type_of_program: '',
      comment: '',
    }

    this.submit = this.submit.bind(this);
  }

  submit(){
    let files = {
      name_of_programe: this.state.name_of_programe,
      status: this.state.status,
      country: this.state.country,
      year_of_fly: this.state.year_of_fly,
      where_from: this.state.where_from,
      data_of_will_fly: this.state.data_of_will_fly,
      comment: this.state,comment,
      type_of_program: this.state.type_of_program,
    }

    if(
      files.name_of_programe &&
      files.status != 'Статус заявки' &&
      files.country &&
      files.year_of_fly &&
      files.where_from &&
      files.data_of_will_fly &&
      files.type_of_program
    ){
    fetch('/UserRequest',
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
            if(data){
              this.props.onHideContinue();
              alert("Заявка добавлена.");
            }
            return;
            });
        })
      }
      else{
        console.log("Not all positions were written!");
      }
    };

  render(){
    let modal =
    <Modal
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
                      {this.state.status}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => this.setState({status: 'Заявка'})}>Заявка</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.setState({status: 'Договор'})}>Договор</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.setState({status: 'Оплата'})}>Оплата</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.setState({status: 'Вылет'})}>Вылет</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.setState({status: 'Консультирование'})}>Консультирование</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.setState({status: 'Не заполнен'})}>Не заполнен</Dropdown.Item>
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
