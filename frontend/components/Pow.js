import React,{ Component } from "react";
import ReactDOM from "react-dom";

export default class Pow extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
    }
  }

  render(){
    let row =
      <tr style={{textAlign: "center", fontSize: "10pt"}}
      onClick={() => this.props.openInfo(this.props.data)}
      >
        <th>{this.props.StatusForm(this.state.data.request.status) || " Не заполнено"}</th>
        <td>{this.state.data.client.client_name  || " Не заполнено "}</td>
        <td>{this.state.data.request.program_name  || " Не заполнено "}</td>
        <td>{this.state.data.request.country  || " Не заполнено "}</td>
        <td>{this.props.SetDate(this.state.data.request.departure_date)  || " Не заполнено "}</td>
      </tr>;

    return(row)
  }
};
