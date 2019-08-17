import React from "react";
import ReactDOM from "react-dom";
import {InputGroup, FormControl, Button, OverlayTrigger, Popover,
				Form} from "react-bootstrap";

export default class Search extends React.Component{
	constructor(props){
		super()
	}

	sendSubmit(){
		return false;
	}

	render(){
		const main = this;

		const popover =
		<Popover id="popover-basic" title="Параметры">
			<Form.Control type="text" placeholder="Номер телефона" />

		</Popover>;

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
					<OverlayTrigger trigger="click" placement="auto" overlay={popover}>
			        <Button variant="outline-danger" size="sm">
							    Фильтр
							</Button>
					</OverlayTrigger>
				</div>

		return(searchLine);
	}
}
