import React from "react";
import ReactDOM from "react-dom";
import {InputGroup, FormControl, Button} from "react-bootstrap";

export default class Search extends React.Component{
	constructor(props){
		super()
	}

	sendSubmit(){
		return false;
	}

	render(){
		const main = this

		let searchLine = 
				<div>
					<InputGroup className="my-3">
				        <FormControl
				            name="SearchLine"
				            placeholder="Ф.И.О."
				            aria-label="Recipient's username"
				            aria-describedby="basic-addon2"
				            onKeyPress={ (event) => {
				              if(event.key == 'Enter' ){
				                main.sendSubmit();
				              }
				              return false;
				            }}
				            size="lg"
				          />
			          <InputGroup.Append>
			            <Button variant="outline-danger"
			              onClick={this.sendSubmit}
			              style={{
			              	width: "100px",
			              }}
			            >
			            Поиск
			            </Button>
			            </InputGroup.Append>
			        </InputGroup>
			        <Button variant="outline-danger" size="sm">
					    Фильтр
					</Button>
				</div>

		return(searchLine);
	}
}