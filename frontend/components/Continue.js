import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Modal, Dropdown, Button, InputGroup,
  Form, Col, Row, ButtonGroup, Alert} from "react-bootstrap";

export default class Continue extends Component{
  constructor(props){
    super(props);
    this.state = {
      status: 'Статус заявки',
      country: '',
      name_of_program: '',
      date_of_will_fly: '',
      type_of_program: '',
      comment: '',
      id: this.props.id,

      alert: false,
    }

    this.submit = this.submit.bind(this);
  }

  submit(){
    let files = {
      name_of_program: this.state.name_of_program,
      status: this.state.status,
      country: this.state.country,
      date_of_will_fly: this.state.date_of_will_fly,
      comment: this.state.comment,
      type_of_program: this.state.type_of_program,
      id: this.state.id
    }
    console.log(files);

    const main = this;

    if(
      files.name_of_program &&
      files.status != 'Статус заявки' &&
      files.country &&
      files.date_of_will_fly &&
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
            console.log('Looks like there was a problem. Status Code: ' + response.status);
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
              main.props.updateId(0);
            }
            return;
            });
        })
      }
      else{
        console.log("Not all positions were written!");
        main.setState({alert: true})
      }
    };

    componentWillReceiveProps(nextProps){
      this.setState({id: nextProps.id})
    }

  render(){
    let modal =
    <Modal
        show={this.props.showWindow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={() => this.props.updateId(0)}
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
              onChange={(e) => this.setState({name_of_program: e.target.value})}
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
                      <Dropdown.Item onClick={() => this.setState({status: 'Закрыто'})}>Закрыто</Dropdown.Item>
                      <Dropdown.Item onClick={() => this.setState({status: 'Не заполнен'})}>Не заполнен</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
              </InputGroup.Append>
            </InputGroup>
            <Form.Row className="mb-0">
              <Form.Group as={Col} controlId="formGridText">
                {/* Дата отъезда ниже */}
                <div class="well">
                    <input type="date" class="form-control" id="exampleInputDOB1" placeholder="Дата отъезда"
                           onChange={(e) => this.setState({date_of_will_fly: e.target.value})}
                    />
                </div>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                    {this.state.suggestion || "Источник заявки"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => this.setState({suggestion: 'Агент'})}>Агент</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.setState({suggestion: 'Соц.сети'})}>Соц.сети</Dropdown.Item>
                    <Dropdown.Item onClick={() => this.setState({suggestion: 'Повторный клиент'})}>Повторный клиент</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
            </Form.Row>
            <Form.Row className="mt-0">
                <Form.Group as={Col} controlId="formGridText">
                  <Form.Control type="text" placeholder="Страна"
                                onChange={(e) => this.setState({country: e.target.value})}
                  />
                </Form.Group>
            </Form.Row>
            <Form.Control className="mb-3" type="text" placeholder="Группа / Индивидуально"
                          onChange={(e) => this.setState({type_of_program: e.target.value})}
            />
            <Form.Control as="textarea" type="text" placeholder="Комментарий" style={{minHeight: "50px"}}
                          onChange={(e) => this.setState({comment: e.target.value})}
            />
      </Form>

      {this.state.alert ?
      <Alert variant="danger" className="mt-3" onClose={() => this.setState({alert: false})} dismissible>
        <p>
          Не все позиции заполнены!
        </p>
      </Alert> : null}

    </Modal.Body>
      {/* Кнопки для сохранения и выхода */}
      <Modal.Footer>
        <Button onClick={this.submit}
                variant="outline-warning"
                centered
        >Сохранить</Button>
      </Modal.Footer>
    </Modal>;

    return(modal);
  }
}
