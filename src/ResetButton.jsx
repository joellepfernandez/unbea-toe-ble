import React, { Component } from 'react';
import './ResetButton.css';
  
export default class ResetButton extends Component {

  render(){
    return (
      <button className="btn" onClick={this.props.reset}>Reset</button>
    );
  }
}