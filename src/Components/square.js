import React from 'react';
//import Button from 'react-bootstrap/Button';
import {FormInput, Button } from "shards-react";

class Square extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      edit: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e){
    //e.preventDefault();
    const rowNumber = this.props.row;
    const colNumber = this.props.col;
    const keyPressed = parseInt(e.key);
    var digits = [1,2,3,4,5,6,7,8,9];

    if (e.key === "Backspace" || e.key === "Delete") {
      this.props.pressKey(null,rowNumber,colNumber);
    }
    else {
      if (digits.indexOf(keyPressed) !== -1){
        this.props.pressKey(e.key,rowNumber,colNumber);
      }
      this.handleClick(); 
    } 
  }

  handleClick(){
    this.setState(()=>({edit: !this.state.edit}));
  }
  
  render(){
    let btn;

    if (this.props.modify === false){
      btn = <Button disabled theme="dark" className="square">{this.props.number}</Button>;
    } else {
      if (!this.state.edit) {
        btn = <Button onClick={this.handleClick} theme="light" className="square">{this.props.number}</Button>;
      } else {
        btn = <FormInput autoFocus={true} onBlur={this.handleClick}  
           onKeyDown={(e)=>this.handleKeyPress(e)}
           className="square" value={this.props.number}></FormInput>
      }
    }

    return(
      btn
    );
  }
}

/*
class ActiveSquare extends React.Component{
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e){
    e.preventDefault();
    const rowNumber = this.props.row;
    const colNumber = this.props.col;
    const keyPressed = parseInt(e.key);
    var digits = [1,2,3,4,5,6,7,8,9];
    if (digits.indexOf(keyPressed) !== -1 || e.key === "Backspace" || e.key === "Delete"){
      this.props.pressKey(e.key,rowNumber,colNumber);
    }
  }
  
  render(){
    return(
        <FormInput className="square"
                   onKeyDown={(e)=>this.handleKeyPress(e)}>
            {this.props.number}
        </FormInput>
    );
  }
}
*/

export {Square};