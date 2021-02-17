import React from 'react';
import './App.sass';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      equationFirst: "",
      equationOperator: "",
      equationLast: "",
      oldEquationFirst: "",
      oldEquationOperator: "",
      oldEquationLast: "",
      oldEquationProduct: "",
      focusedButton: "",
      activeButton: "",
      theme: "dark",
      nanMessage: "Not a number",
      nanState: false,
    }
  }

  componentDidMount = () => {
    // Add all event listeners
    document.addEventListener("keydown", event => {
      if (["0","1","2","3","4","5","6","7","8","9","C","Clear","Delete","Backspace","%",".","/","*","-","+","=","Enter"].indexOf(event.key) > -1) { 
        event.preventDefault();
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
        className={c + (this.state.focusedButton === value  ? ' focus' : '') + (this.state.activeButton === value  ? ' active' : '')} 
        onClick={(e) => this.onButtonClick(value)} 
        arial-label={arial}>
          {value}
        </button>
      </div>
    );
  }

  clearButtonActive = () => {
    this.setState({
      activeButton: "",
    });
  }

  renderDisplay = () => {
    return (
      <div className="display">
        <div className={('old-equation count-characters-' + this.sumCharactersInArray([this.state.oldEquationFirst, this.state.oldEquationOperator, this.state.oldEquationLast]))}>
          {this.maskDecimal(this.state.oldEquationFirst)}
          {this.renderOldOperator()}
          {this.maskDecimal(this.state.oldEquationLast)}
        </div>
        <div className={('current-equation count-characters-' + this.sumCharactersInArray([this.state.equationFirst, this.state.equationOperator, this.state.equationLast]))}>
          {this.maskDecimal(this.state.equationFirst)}
          {this.renderOperator()}
          {this.maskDecimal(this.state.equationLast)}
        </div>
      </div>
    );
  }

  renderOldOperator = () => {
    if (this.state.oldEquationOperator !== "") {
      return (
        <span className="operator">
          {this.state.oldEquationOperator}
        </span>
      );
    }
  }

  renderOperator = () => {
    if (this.state.equationOperator !== "") {
      return (
        <span className="operator">
          {this.state.equationOperator}
        </span>
      );
    }
  }

  onButtonClick = button => {
    // Vibrate mobile phone just for fun
    if ("vibrate" in window.navigator) window.navigator.vibrate(50)

    if (this.state.nanState) {
      this.setState({
        nanState: false,
      });
      this.clear();
    }

    if (button === "=" || button === "Enter") {
      // Handle call to calculate function
      if (this.state.oldEquationProduct === "") {
        if (this.state.equationOperator !== "") {
          if (this.state.equationLast === "") {
            this.setState({
              equationLast: this.state.equationFirst,
            }, () => {
              this.calc();
            });
          } else {
            this.calc();
          }
        }
      } else {
        if (this.state.equationOperator !== "") {
          if (this.state.equationLast === "") {
            this.setState({
              equationLast: this.state.equationFirst,
            }, () => {
              this.calc();
            });
          } else {
            this.calc();
          }
        } else {
          if (this.state.oldEquationOperator !== "" && this.state.oldEquationLast !== "") {
            this.setState({
              equationOperator: this.state.oldEquationOperator,
              equationLast: this.state.oldEquationLast,
            }, () => {
              this.calc();
            });
          }
        }
      }

      this.focusButton("=");
    } else if (["AC","Clear","Delete"].indexOf(button) > -1) {
      // Clear all data saved
      this.clear();
      this.focusButton("AC");
    } else if (["CE", "Backspace"].indexOf(button) > -1) {
      // Clear entry
      if (this.state.equationFirst !== "" && this.state.equationOperator === "") {
        if (this.state.oldEquationProduct === "") {
          this.setState({
            equationFirst: this.state.equationFirst.toString().slice(0, -1)
          }); 
        } else {
          if (this.state.equationFirst === this.state.oldEquationProduct) {
            this.clear();
          } else {
            this.setState({
              equationFirst: this.state.equationFirst.toString().slice(0, -1)
            });
          }
        }
      } else if (this.state.equationLast !== "") {
        this.setState({
          equationLast: this.state.equationLast.toString().slice(0, -1)
        }); 
      } else if (this.state.equationOperator !== "" && this.state.equationLast === "") {
        this.clear();
      }

      this.focusButton("CE");
    } else if (button === "+/-") {
      // Switch signal
      if (this.state.equationFirst !== "" && this.state.equationOperator === "") {
        this.setState({
          equationFirst: -this.state.equationFirst
        }); 
      } else if (this.state.equationLast !== "") {
        this.setState({
          equationLast: -this.state.equationLast
        }); 
      }

      this.focusButton(button);
    } else if (button === "%") {
      // Handle Percent action
      if (this.state.equationFirst !== "") {
        this.setState({
          equationOperator: "%",
          equationLast: 100,
        }, () => {
          this.calc();
        }); 
      }

      this.focusButton(button);
    } else if (button === ".") {
      // Handle break to decimal values
      if (this.state.equationFirst !== "" && this.state.equationFirst.indexOf(".") === -1 && this.state.equationOperator === "") { 
        // If current input is 'equationFirst'
        this.setState({
          equationFirst: this.state.equationFirst + ".",
        });
      } else if (this.state.equationLast !== "" && this.state.equationLast.indexOf(".") === -1 && this.state.equationOperator !== "") { 
        // If current input is 'equationLast'
        this.setState({
          equationLast: this.state.equationLast + ".",
        });
      }

      this.focusButton(button);
    } else if (["/", "*", "+", "-"].indexOf(button) > -1) {
      // Handle basic operators
      if (this.state.equationFirst !== "") {
        if (this.state.equationOperator === "" || this.state.equationLast === "") {
          this.setState({
            equationOperator: button,
          }); 
        } else {
          this.calc();
          
          if (this.state.nanState) {
            this.setState({
              equationFirst: "0",
              nanState: false,
            });
          }

          this.setState({
            equationOperator: button,
          });
        }

        this.focusButton(button);
      }
    } else if (["1","2","3","4","5","6","7","8","9"].indexOf(button) > -1) {
      // Handle input numbers to operation (except '0')
      if (!this.state.equationOperator) {
        if (this.state.oldEquationProduct !== "" && this.state.oldEquationProduct === this.state.equationFirst) {
          // Clear data if user try to add value upon last result 
          this.clear();
          this.setState({
            equationFirst: button
          });
        } else { 
          if (this.state.equationFirst !== "0") {
            this.setState({
              equationFirst: this.state.equationFirst + button
            });
          } else {
            this.setState({
              equationFirst: button
            });
          }
        }
      } else {
        if (this.state.equationLast !== "0") {
          this.setState({
            equationLast: this.state.equationLast + button
          });
        } else {
          this.setState({
            equationLast: button
          });
        }
      }

      this.focusButton(button);
    } else if (button === "0") {
      // Handle input number 0 to operation
      if (this.state.oldEquationProduct !== "" && this.state.oldEquationProduct === this.state.equationFirst && this.state.equationOperator === "") {
        // Clear data if user try to add value upon last result 
        this.clear();
        this.setState({
          equationFirst: button
        });
      } else { 
        if (!this.state.equationOperator) {
          if (this.state.equationFirst !== "0") {
            this.setState({
              equationFirst: this.state.equationFirst + button
            });
          }
        } else {
          if (this.state.equationLast !== "0") {
            this.setState({
              equationLast: this.state.equationLast + button
            });
          }
        }
      }

      this.focusButton(button);
    }
  };

  focusButton = button => {
    this.setState({
      focusedButton: button,
      activeButton: button,
    });

    // Remove focus from any button
    document.querySelector("h1").focus();
  }

  calc = () => {
    let result = null;

    switch (this.state.equationOperator) {
      case "/":
      case "%":
        result = Number(this.state.equationFirst) / Number(this.state.equationLast);
        break;
      case "*":
        result = Number(this.state.equationFirst) * Number(this.state.equationLast);
        break;
      case "+":
        result = Number(this.state.equationFirst) + Number(this.state.equationLast);
        break;
      case "-":
        result = Number(this.state.equationFirst) - Number(this.state.equationLast);
        break;

      default: 
        result = "";
        break;
    }

    if (result !== "" && !isFinite(result)) {
      result = this.state.nanMessage;
      this.setState({
        nanState: true,
      }); 
    } else {
      this.setState({
        nanState: false,
      }); 
    };

    this.setState({
      oldEquationFirst: this.state.equationFirst.toString(),
      oldEquationOperator: this.state.equationOperator.toString(),
      oldEquationLast: this.state.equationLast.toString(),
      oldEquationProduct: result.toString(),
    }, () => {
      this.setState({
        equationFirst: result.toString(),
        equationOperator: "",
        equationLast: "",
      });
    });
  }

  clear = () => {
    this.setState({
      equationFirst: "",
      equationOperator: "",
      equationLast: "",
      oldEquationFirst: "",
      oldEquationOperator: "",
      oldEquationLast: "",
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
    if ("vibrate" in window.navigator) window.navigator.vibrate(50)
    
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
    if ("vibrate" in window.navigator) window.navigator.vibrate([100,50,100])

    let btnCls = document.querySelector(".btn-close");

    if(!this.hasClass(btnCls, 'rotate')) {
      this.addClass(btnCls, 'rotate');
      setTimeout(() => {
          this.removeClass(btnCls, 'rotate');
      }, 300);
    }
  }

  hasClass = (ele, cls) => {
    return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  }

  addClass = (ele, cls) => {
    if (!this.hasClass(ele, cls)) ele.className += " "+cls;
  }

  removeClass = (ele, cls) => {
    if (this.hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
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