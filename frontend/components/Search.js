import React from "react";
import ReactDOM from "react-dom";
import {InputGroup, FormControl, Button, OverlayTrigger, Popover,
				Form} from "react-bootstrap";

export default class Search extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			searchLine: '',
			phone_number: '',
			show: false,
			window: !this.props.window
		}

		this.sendSubmit = this.sendSubmit.bind(this);

	}

	componentWillReceiveProps(nextProps){
		this.setState({window: !nextProps.window})
	}

	sendSubmit(){
		let files = {
			searchLine: this.state.searchLine,
			phone_number: this.state.phone_number,
		}
		if(
			files.searchLine ||
			files.phone_number
		){
			fetch('/Search',
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
	            });
	        })
		}
	}

	render(){
		const main = this;

		let popover =
		<Popover id="popover-basic" title="Параметры">
			<Form.Control type="text" placeholder="Номер телефона"
						onChange={(e) => this.setState({phone_number: e.target.value})}
			/>

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
										onChange={(e) => this.setState({searchLine: e.target.value})}
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
							{console.log(this.state.window)}
					<OverlayTrigger trigger="click" placement="auto"
													overlay={(this.state.window) ? popover : <div></div>}
												>
			        <Button variant="outline-danger" size="sm"
							>
							    Фильтр
							</Button>
					</OverlayTrigger>
				</div>

		return(searchLine);
	}
}
