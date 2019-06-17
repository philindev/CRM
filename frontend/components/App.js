import React from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col} from "react-bootstrap"
import Header from "./Header"

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
					<Col
						md={12}
			            sm={12}
			            xs={12}
					>
					< Header />
					</Col>
				</Row>
				<Row>

				</Row>
				<Row>

				</Row>
				<Row>

				</Row>
			</Container>
		)};
};

export default App;