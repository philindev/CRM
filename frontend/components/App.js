import React from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col} from "react-bootstrap"

class App extends React.Component{
	constructor(props){
		super();
		this.state = {
			text : "Hello"
		}
	}

	render(){
		return(
			<Container>
				<Row>
					<Col style={{fontSize: "28px"}}>
						{this.state.text}
					</Col>
				</Row>
			</Container>
		)};
};

export default App;