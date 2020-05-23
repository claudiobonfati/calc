import React from 'react';
import './App.sass';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      equation_first: "",
      equation_operator: "",
      equation_last: "",
      equation_completed: false,
      old_equation_first: "",
      old_equation_operator: "",
      old_equation_last: "",
      old_equation_result: "",
      focus_button: "",
      active_button: "",
      theme: "dark",
    }
  }

  componentDidMount = () => {
    // Add all event listeners
    document.addEventListener("keydown", event => {
      if (["0","1","2","3","4","5","6","7","8","9","C","Clear","Delete","Backspace","%",".","/","*","-","+","=","Enter"].indexOf(event.key) > -1) { 
        this.onButtonClick(event.key);
      }
    }, false);
    document.addEventListener("keyup", event => { this.clearButtonActive() }, false);
    document.addEventListener("mouseup", event => { this.clearButtonActive() }, false);
  }

  renderButton = (value, c, arial) => {
    return (
      <div className="box-button selection-none">
        <button 
        className={c + (this.state.focus_button === value  ? ' focus' : '') + (this.state.active_button === value  ? ' active' : '')} 
        onClick={(e) => this.onButtonClick(value)} 
        arial-label={arial}>
          {value}
        </button>
      </div>
    );
  }

  clearButtonActive = () => {
    this.setState({
      active_button: "",
    });
  }

  renderDisplay = () => {
    return (
      <div className="display">
        <div className={('old-equation count-characters-' + this.sumCharactersInArray([this.state.old_equation_first, this.state.old_equation_operator, this.state.old_equation_last]))}>
          {this.maskDecimal(this.state.old_equation_first)}
          {this.renderOldOperator()}
          {this.maskDecimal(this.state.old_equation_last)}
        </div>
        <div className={('current-equation count-characters-' + this.sumCharactersInArray([this.state.equation_first, this.state.equation_operator, this.state.equation_last]))}>
          {this.maskDecimal(this.state.equation_first)}
          {this.renderOperator()}
          {this.maskDecimal(this.state.equation_last)}
        </div>
      </div>
    );
  }

  renderOldOperator = () => {
    if (this.state.old_equation_operator !== "") {
      return (
        <span className="operator">
          {this.state.old_equation_operator}
        </span>
      );
    }
  }

  renderOperator = () => {
    if (this.state.equation_operator !== "") {
      return (
        <span className="operator">
          {this.state.equation_operator}
        </span>
      );
    }
  }

  onButtonClick = button => {
    // Vibrate mobile phone just for fun
    if (window.navigator) window.navigator.vibrate(50)
    
    if (button === "=" || button === "Enter") {
      // Handle call to calculate function
      if (!this.state.equation_completed) {
        if (this.state.equation_operator !== "") {
         if (this.state.equation_last === "") {
          this.setState({
            equation_last: this.state.equation_first,
          }, () => {
            this.calc();
          });
         } else {
            this.calc();
         }
        }
      } else {
        if (this.state.equation_operator !== "") {
          if (this.state.equation_last === "") {
            this.setState({
              equation_last: "0",
            }, () => {
              this.calc();
            });
          } else {
            this.calc();
          }
        } else {
          this.setState({
            equation_operator: this.state.old_equation_operator,
            equation_last: this.state.old_equation_last,
          }, () => {
            this.calc();
          });
        }
      }

      this.focusButton("=");
    } else if (["AC","Clear","Delete"].indexOf(button) > -1) {
      // Clear all data saved
      this.clear();
      this.focusButton("AC");
    } else if (["CE", "Backspace"].indexOf(button) > -1) {
      // Clear entry
      if (this.state.equation_first !== "" && this.state.equation_operator === "") {
        if (!this.state.equation_completed) {
          this.setState({
            equation_first: this.state.equation_first.toString().slice(0, -1)
          }); 
        } else {
          this.clear();
        }
      } else if (this.state.equation_last !== "") {
        this.setState({
          equation_last: this.state.equation_last.toString().slice(0, -1)
        }); 
      } else if (this.state.equation_operator !== "" && this.state.equation_last === "") {
        this.clear();
      }

      this.focusButton("CE");
    } else if (button === "+/-") {
      // Switch signal
      if (this.state.equation_first !== "" && this.state.equation_operator === "") {
        this.setState({
          equation_first: -this.state.equation_first
        }); 
      } else if (this.state.equation_last !== "") {
        this.setState({
          equation_last: -this.state.equation_last
        }); 
      }

      this.focusButton(button);
    } else if (button === "%") {
      // Handle Percent action
      if (this.state.equation_first !== "") {
        this.setState({
          equation_operator: "%",
          equation_last: 100,
        }, () => {
          this.calc();
        }); 
      }

      this.focusButton(button);
    } else if (button === ".") {
      // Handle break to decimal values
      if (this.state.equation_first !== "" && this.state.equation_first.indexOf(".") === -1 && this.state.equation_operator === "") { // If current input is 'equation_first'
        this.setState({
          equation_first: this.state.equation_first + ".",
        });
      } else if (this.state.equation_last !== "" && this.state.equation_last.indexOf(".") === -1 && this.state.equation_operator !== "") { // If current input is 'equation_last'
        this.setState({
          equation_last: this.state.equation_last + ".",
        });
      }

      this.focusButton(button);
    } else if (["/", "*", "+", "-"].indexOf(button) > -1) {
      // Handle basic operators
      if (this.state.equation_first !== "") {
        if (this.state.equation_operator === "" || this.state.equation_last === "") {
          this.setState({
            equation_operator: button,
          }); 
        } else {
          this.calc();
          this.setState({
            equation_operator: button,
          });
        }

        this.focusButton(button);
      }
    } else if (["1","2","3","4","5","6","7","8","9"].indexOf(button) > -1) {
      // Handle input numbers to operation (except '0')
      if (!this.state.equation_operator) {
        if (this.state.equation_completed && this.state.old_equation_result === this.state.equation_first) {
          // Clear data if user try to add value upon last result 
          this.clear();
        }
        if (this.state.equation_first !== "0") {
          this.setState({
            equation_first: this.state.equation_first + button
          });
        } else {
          this.setState({
            equation_first: button
          });
        }
      } else {
        if (this.state.equation_last !== "0") {
          this.setState({
            equation_last: this.state.equation_last + button
          });
        } else {
          this.setState({
            equation_last: button
          });
        }
      }

      this.focusButton(button);
    } else if (button === "0") {
      // Handle input number 0 to operation

      if (!this.state.equation_operator) {
        if (this.state.equation_first !== "0") {
          this.setState({
            equation_first: this.state.equation_first + button
          });
        }
      } else {
        if (this.state.equation_first !== "0") {
          this.setState({
            equation_last: this.state.equation_last + button
          });
        }
      }

      this.focusButton(button);
    }
  };

  focusButton = button => {
    this.setState({
      focus_button: button,
      active_button: button,
    });
  }

  calc = () => {
    let result = null;

    switch (this.state.equation_operator) {
      case "/":
      case "%":
        result = Number(this.state.equation_first) / Number(this.state.equation_last);
        break;
      case "*":
        result = Number(this.state.equation_first) * Number(this.state.equation_last);
        break;
      case "+":
        result = Number(this.state.equation_first) + Number(this.state.equation_last);
        break;
      case "-":
        result = Number(this.state.equation_first) - Number(this.state.equation_last);
        break;

      default: 
        result = "Ops...";
        break;
    } 

    this.setState({
      old_equation_first: this.state.equation_first,
      old_equation_operator: this.state.equation_operator,
      old_equation_last: this.state.equation_last,
      old_equation_result: result,
    }, () => {
      this.setState({
        equation_first: result,
        equation_operator: "",
        equation_last: "",
        equation_completed: true,
      });
    });
  }

  clear = () => {
    this.setState({
      equation_first: "",
      equation_operator: "",
      equation_last: "",
      equation_completed: false,
      old_equation_first: "",
      old_equation_operator: "",
      old_equation_last: "",
    });
  }

  maskDecimal = val => {
    return val.toString().replace(".", ",");
  }

  sumCharactersInArray = values => {
    let sum = 0;

    values.forEach(v => sum += v.toString().length);

    return sum;
  }

  switchThene = () => {
    // Vibrate mobile phone just for fun
    if (window.navigator) window.navigator.vibrate(50)
    
    let metaThemeColor = document.querySelector("meta[name=theme-color]");
    
    if (this.state.theme === "dark") {
      this.setState({
        theme: "light",
      });

      metaThemeColor.setAttribute("content", "#FFFFFF");
    } else {
      this.setState({
        theme: "dark",
      });
      
      metaThemeColor.setAttribute("content", "#151515");
    }
  }

  closeButton = () => {
    // Vibrate mobile phone just for fun
    if (window.navigator) window.navigator.vibrate([100,50,100])

    // PWA exit app
    if (navigator.app) navigator.app.exitApp();
    return;
  }

  render() {
    return (
      <div className={'App theme-' + this.state.theme}>
        <div className="main-container">
          <div className="calculator">
            <div className="inner">
              <div className="notch">
                <svg id="svg-notch" data-name="Notch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 318.21 41.32">
                  <path className="path-notch" d="M318.21,41.32v-3.6A37.72,37.72,0,0,0,280.49,0H255.35c-4.39,0-8,1.05-8,5.94,0,.28-.17,3.44-.17,3.44-.63,8.93-7.26,15.5-16.63,16.07l-71.49.15-71.49-.15c-9.37-.57-16-7.14-16.62-16.07,0,0-.18-3.16-.18-3.44,0-4.89-3.56-5.94-8-5.94H37.72A37.72,37.72,0,0,0,0,37.72v3.6"/>
                </svg>
              </div>
              <div className="content">
                <header className="header">
                  <div className="btn-menu" onClick={(e) => this.switchThene()}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <h1 className="centered selection-none">
                    Calc<span>.</span>
                  </h1>
                  <div className="btn-close" onClick={(e) => this.closeButton()} >
                    <span></span>
                    <span></span>
                  </div>
                </header>
                {this.renderDisplay()}
                <div className="keyboard">
                  <div className="row">
                    {this.renderButton("AC", "helper", "Clear All")}
                    {this.renderButton("+/-", "helper", "Positive/Negative")}
                    {this.renderButton("%", "helper", "Percent")}
                    {this.renderButton("/", "action", "Division")}
                  </div>
                  <div className="row">
                    {this.renderButton("7", "number")}
                    {this.renderButton("8", "number")}
                    {this.renderButton("9", "number")}
                    {this.renderButton("*", "action", "Multiplication")}
                  </div>
                  <div className="row">
                    {this.renderButton("4", "number")}
                    {this.renderButton("5", "number")}
                    {this.renderButton("6", "number")}
                    {this.renderButton("-", "action", "Minus")}
                  </div>
                  <div className="row">
                    {this.renderButton("1", "number")}
                    {this.renderButton("2", "number")}
                    {this.renderButton("3", "number")}
                    {this.renderButton("+", "action", "Plus")}
                  </div>
                  <div className="row">
                    {this.renderButton("CE", "helper", "Clear Entry")}
                    {this.renderButton("0", "number")}
                    {this.renderButton(".", "helper")}
                    {this.renderButton("=", "submit", "Equals")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="credit-bottom-left selection-none">
            coded with <span role="img" aria-label="coffee">☕</span> by <strong><a href="https://www.linkedin.com/in/claudiobonfati/" rel="noopener noreferrer" target="_blank" className="credit-link" title="LinkedIn Claudio Bonfati">Claudio Bonfati</a></strong>
          </div>
          <div className="credit-bottom-right selection-none">
            designed with <span role="img" aria-label="a pen">🖊️</span> by <strong><a href="https://www.linkedin.com/in/niculici/" rel="noopener noreferrer" target="_blank" className="credit-link" title="LinkedIn Victor Niculici">Victor Niculici</a></strong>
          </div>
        </div>
      </div>
    );
  }
}

export default App;