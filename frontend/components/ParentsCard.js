import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Card, Col} from "react-bootstrap";

export default class ParentCard extends Component{
  constructor(props){
    super(props);
    this.state = {
        name: this.props.data.name,
        email: this.props.data.email,
        work: this.props.data.work,
        phone: this.props.data.phone_number,
    }
  }


  render(){
    let windows =
        <Card style={{ width: '18rem' }} className="mt-3 mr-3 mb-3" style={{maxWidth: "70%"}}>
          <Card.Body>
            <Card.Title style={{fontSize: "16px"}}>{this.state.name || "Не указано"}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted" style={{fontSize: "12px"}}>{this.state.email || "Не указано"}</Card.Subtitle>
            <Card.Text style={{fontSize: "14px"}}>

                <b>Номер:</b> {this.state.phone || "Не указано"}
                <br />
                <b>Должность:</b> {this.state.work || "Не указано"}
                <br />

            </Card.Text>
          </Card.Body>
        </Card>

    return(windows)
  }

}
