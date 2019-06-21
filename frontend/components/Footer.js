import React from "react";
import ReactDOM from "react-dom";
import {Col} from "react-bootstrap";

export default class Footer extends React.Component{
	constructor(props){
		super()
	}

	render(){

		let footer = 
				<Col 
					md={12}
		            sm={12}
		            xs={12}
		            style={{
		            	position: "absolute",
		            	marginBottom: "0",
		            	paddingBottom: "0",
						bottom: "0",
						fontSize: "9pt",
						overflow: "hidden",
		            }} 
				>
					<hr color="grey" width="960px" align="left"/>
					<p>Copyright © FirstAcademy</p>
				</Col>;

		return(footer);
	}
}