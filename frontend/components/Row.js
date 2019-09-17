import React,{ Component } from "react";
import ReactDOM from "react-dom";

export default class Row extends Component{
  render(){
    return(
      <tr style={{textAlign: "center", fontSize: "10pt"}}
      onClick={() => this.props.openInfo(this.props.data)}
      >
        <th>{this.props.StatusForm(this.props.data.request.status)}</th>
        <td>{this.props.data.client.client_name}</td>
        <td>{this.props.data.request.program_name}</td>
        <td>{this.props.data.request.country}</td>
        <td>{this.props.SetDate(this.props.data.request.departure_date)}</td>
      </tr>
    );
  }
};
