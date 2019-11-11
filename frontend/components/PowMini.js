import React,{ Component } from "react";
import ReactDOM from "react-dom";

export default class PowMini extends Component{
  constructor(props){
    super(props);
    this.state = {
      data: this.props.data,
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.data})
  }

  render(){
    console.log(this.state.data);
    let row =
      <tr style={{textAlign: "center", fontSize: "10pt"}}
      onClick={() => this.props.openInfo(this.props.data)}
      >
        <th>{this.props.StatusForm(this.state.data.request.status) || " Не заполнено"}</th>
        <td>{this.state.data.client.client_name  || " Не заполнено "}</td>
        <td>{this.state.data.request.program_name  || " Не заполнено "}</td>
      </tr>;

    return(row)
  }
};
