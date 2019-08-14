import React,{ Component } from "react";
import ReactDOM from "react-dom";

export default class Row extends Component{
  render(){
    return(
      <tr style={{textAlign: "center", fontSize: "10pt"}}
      onClick={() => this.props.openInfo(this.props.data)}
      >
        <th>{this.props.data.status}</th>
        <td>{this.props.data.name}</td>
        <td>{this.props.data.program}</td>
        <td>{this.props.data.country}</td>
        <td>{this.props.data.data}</td>
      </tr>
    );
  }
};
