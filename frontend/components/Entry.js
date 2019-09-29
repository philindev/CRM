import React, {Component} from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {Button} from "react-bootstrap"

export default class Entry extends Component{
  constructor(props){
    super(props);
    this.state = {
      login: '',
      password: '',
      enter: false,
      token: null,
      user_status: "guest",
      error: false,
    }

    this.submit = this.submit.bind(this);
    this.exit = this.exit.bind(this);

  }

  exit(){
    this.setState({
      token: null,
      user_status: "guest",
      enter: false,
    })
  }

  submit(){
    const main = this;
    let data = {login: this.state.login, password: this.state.password}
    if(data.login && data.password){
      fetch('/Entry',
	        {
	          method: 'post',
	          headers: {
	            'Content-Type':'application/json',
	            "Access-Control-Allow-Origin": "*",
	            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
	          },
	          body: JSON.stringify(data),
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
              if(data != null){
                main.setState({
                  enter: true,
                  token: data.token,
                  user_status: data.status,
                })
                console.log("Welcome")
              }
              else{
                console.log("Not right");

              }
	            });
	        }).catch(function (error) {
  			    console.log('error: ', error)
  					main.setState({error: true})
  			  })
    }
  }

  render(){
    let user = {
      user_status: this.state.user_status,
      token: this.state.token,
    }

    let entryWindow = (!this.state.enter) ?

    <div class="login-page" id="entry">
      <div class="form">
          <div class="greetings">Добро пожаловать</div>
          <form class="login-form">
            <input type="text" placeholder="Логин" onChange={(e) => this.setState({login: e.target.value})}/>
            <input type="password" placeholder="Пароль" onChange={(e) => this.setState({password: e.target.value})}/>
            <Button onClick={this.submit}>Войти</Button>
          </form>
      </div>
    </div>

    : <App exit={this.exit} user={user}/>;

    return(entryWindow)
  }
}
