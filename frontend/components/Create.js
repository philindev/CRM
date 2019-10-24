import React, { Component } from "react";
import ReactDOM from 'react-dom';
import {Modal, Button, Form, Dropdown,
  InputGroup, Col, Row, ButtonGroup, Alert, Input} from "react-bootstrap";
import Parent from "./Parent.js";

export default class Create extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      status: 'Статус заявки',
      date_of_birth: '',
      number: '',
      mail: '',
      countParent: 1,
      firstParent: {},
      secondParent: {},
      error_window_show: false,
      description: '',
    };

    this.openContinue = this.openContinue.bind(this);
    this.sendProfile = this.sendProfile.bind(this);
    this.addParent = this.addParent.bind(this);
    this.updateParent = this.updateParent.bind(this);
    this.permissionToDeleteParent = this.permissionToDeleteParent.bind(this);
  }

  // Закрывает и открывает окно заявки
  openContinue(){
    this.props.onHideCreate();
  }

  permissionToDeleteParent(){
        this.setState({
          countParent: 1,
          secondParent: {}
        })
  }

  sendProfile(whichWindow){
    const main = this;

    let files = {
      name: this.state.name,
      status: this.state.status,
      date_of_birth: this.state.date_of_birth,
      number: this.props.preparingNumber('+7' + this.state.number),
      mail: this.state.mail,
      firstParent: this.state.firstParent,
      secondParent: this.state.secondParent,
    }
    if(
        files.name != '' &&
        files.status != 'Статус заявки' &&
        files.date_of_birth != '' &&
        files.number != '' &&
        files.mail != '' &&
        Object.keys(files.firstParent).length == 4
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
            if(data){
              if(whichWindow == 1){
                main.props.onHideCreate();
              }
              else if (whichWindow == 2) {
                main.props.changeId(data);
                main.openContinue();
              }
            }
            else{
              console.log('Error submit!')
            }
            return;
            });
        })
      }
      else{
        console.log("Not all positions were written!")
        console.log(files)
        let description = 'Заполните все позиции и повторите сохранение.'
        if(files.name == ''){
          description = "Заполните поле \"Ф.И.О.\""
        }
        else if (files.date_of_birth == '') {
          description = "Введите дату рождения."
        }
        else if (files.number == '') {
          description = "Введите номер телефона клиента."
        }
        else if (Object.keys(files.firstParent).length != 4) {
          description = 'Данные родителя пропущенны в одном или нескольких местах!'
        }
        this.setState({error_window_show: true, description: description});
      }
    };

    addParent(){
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
            <Form className="mb-3">
              <InputGroup className="mb-3">
                <Form.Control
                  type="text" placeholder="Ф.И.О."
                  onChange={(e) => {this.setState({ name: e.target.value })}}
                />


                    <InputGroup.Append>
                      {/* Статус заявки выпадающее меню */}
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        {this.state.status}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => {this.setState({status: 'V.I.P.'})}}>V.I.P.</Dropdown.Item>
                          <Dropdown.Item onClick={() => {this.setState({status: 'Новый'})}}>Новый</Dropdown.Item>
                          <Dropdown.Item onClick={() => {this.setState({status: 'Повторный'})}}>Повторный</Dropdown.Item>
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
                        onChange={(e) => {this.setState({ date_of_birth: e.target.value })}}
                        />
                      </div>
                    </div>
                  </Form.Group>


                  <InputGroup as={Col} controlId="formGridPassword" style={{marginBottom: '0px', paddingBottom: "0px"}}>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-md"> +7</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control type="phone" placeholder="Номер телефона"
                    onChange={(e) => {this.setState({ number: e.target.value })}}
                    />
                </InputGroup>
                </Form.Row>


                <Form.Control type="email" placeholder="Почта" className="mb-2"
                  onChange={(e) => {this.setState({ mail: e.target.value })}}
                />

                <span>Заполните 1 родителя:</span>
                <Parent data={this.state.firstParent} which={0} updateParent={this.updateParent}/>
                {(this.state.countParent > 1) ? <span>Заполните 2 родителя:</span> : null}
                {(this.state.countParent > 1) ? <Parent data={this.state.secondParent} which={1} updateParent={this.updateParent}/>: null}

                {(this.state.countParent == 1) ?
                  <ButtonGroup aria-label="Basic example" className="mt-3">
                      <Button variant="danger" className="mr-3"
                          onClick={this.addParent}
                      >Добавить родителя</Button>
                  </ButtonGroup>

                  :

                  <ButtonGroup aria-label="Basic example" className="mt-3">
                      <Button variant="secondary" className="mr-3"
                          onClick={this.permissionToDeleteParent}
                      >Удалить родителя</Button>
                  </ButtonGroup>
                }


                    {/* Вича для добавления дополнительного поля */}

                    {/*<Button variant="success">Добавить поле</Button> */}

          </Form>

          {
                  (this.state.error_window_show)?
                    <Alert variant="danger" onClose={() => this.setState({error_window_show: false})} dismissible>
                      <Alert.Heading>Не все позиции заполнены!</Alert.Heading>
                      <p>
                        {this.state.description}
                      </p>
                    </Alert>
                  :null
            }

        </Modal.Body>
          {/* Кнопки для сохранения и выхода */}
          <Modal.Footer>
            <Button onClick={() => this.sendProfile(1)}
                    variant="outline-warning"
            >Сохранить</Button>
            <Button onClick={() => this.sendProfile(2)}
                    variant="outline-info"
            >Продолжить</Button>
          </Modal.Footer>
        </Modal>;

    return(windowClient);
  }
};
