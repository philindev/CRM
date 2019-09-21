
import React, {Component} from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

class Entry extends Component{
  constructor(props){
    super(props);
    this.state = {
      enter: false,
    }
  }

  render(){
    let entryWindow = (this.state.enter) ?
    < App /> :

        <div class="limiter">
          <div class="container-login100">
            <div class="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-50">
              <form class="login100-form validate-form">
                <span class="login100-form-title p-b-33">
                  Добро пожаловать
                </span>

                <div class="wrap-input100 validate-input" data-validate = "Логин обязателен">
                  <input class="input100" type="text" placeholder="Логин" />
                  <span class="focus-input100-1"></span>
                  <span class="focus-input100-2"></span>
                </div>

                <div class="wrap-input100 rs1 validate-input" data-validate="Пароль обязателен">
                  <input class="input100" type="password" name="pass" placeholder="Пароль" />
                  <span class="focus-input100-1"></span>
                  <span class="focus-input100-2"></span>
                </div>

                <div class="container-login100-form-btn m-t-20">
                  <button class="login100-form-btn">
                    Войти
                  </button>
                </div>

                {/*<div class="text-center p-t-45 p-b-4">
                  <span class="txt1">
                    Forgot
                  </span>

                  <a href="#" class="txt2 hov1">
                    Username / Password?
                  </a>
                </div>

                <div class="text-center">
                  <span class="txt1">
                    Create an account?
                  </span>

                  <a href="#" class="txt2 hov1">
                    Sign up
                  </a>
                </div>*/}
              </form>
            </div>
          </div>
        </div>

    ;

    return(entryWindow)
  }
}





ReactDOM.render(<Entry />, document.getElementById("project"));
