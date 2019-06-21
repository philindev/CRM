import React from "react";
import ReactDOM from "react-dom";
import {Container, Row, Col} from "react-bootstrap";
import Header from "./Header";
import Search from "./Search";
import Clients from "./Clients";

class App extends React.Component{
	constructor(props){
		super();
		this.state = {
			whatsBlock : 0,
			submit: null,
		}
	}

	render(){


		let mainBlock = null;

		switch(this.state.whatsBlock){
			case 0:
			
		};

		return(
			<Container>
				<Row>
					<Col
						md={12}
			            sm={12}
			            xs={12}
					>
					<Header />
					</Col>
				</Row>
				<Row>
						<Col
							lg={8}
							md={8}
						>
							<Row>
								{/*Здесь рендер поисковой строки*/}
								<Col className="mt-4"
									lg={11}
									md={11}
								>
									<Search />
								</Col>
							</Row>
							<Row className="mt-4">
								{/*Главный блок с клиентами*/}
								<Clients />
							</Row>
						</Col>
					</Row>
			</Container>
		)};
};

export default App;