import React, { Component } from 'react';
const LETTERS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
const SYMBOLS = [ "=","+","-","^","?","!","%","&","*","$","#","^","@","|"];

function randomLetter(){
    return LETTERS[Math.floor(Math.random()*LETTERS.length)]
}
function randomDigitPosition(digitsPositionArray){
    return digitsPositionArray[Math.floor(Math.random()*digitsPositionArray.length)]
}
function randomSymbol(){
    return SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]
}
class PasswordGenerator extends Component {
    constructor(props){
        super(props)
        this.state = {
            password: '',
            length: 12,
            digits: 4,
            symbols: 2,
            copy: false,
            strengthScore: 0,
            strengthText: '',
            settings: {
                maxLength: 64,
                maxDigits: 10,
                maxSymbols: 10,
            }
        }
    }
    componentDidMount(){
        this.generatePassword()
        this.checkPasswordStrength()
        document.getElementById("copy_btn").addEventListener("click", this.copyToClipboard);
    }
    componentWillUnmount(){
        document.getElementById("copy_btn").removeEventListener("click", this.copyToClipboard);
    }
    generatePassword = () => {
        let passwordArray = [];
        let digitsPositionArray = [];

        const { length, digits, symbols } = this.state;

        for(var i = 0; i < length; i++){
            digitsPositionArray.push(i);
            var upperCase = Math.round(Math.random() * 1);
            if(upperCase === 0) {
                passwordArray[i] = randomLetter().toUpperCase();
            }
            else {
                passwordArray[i] = randomLetter();
            }
        }

        for(i=0; i < digits; i++){
            var digit = Math.round(Math.random() * 9);
            var numberIndex = randomDigitPosition(digitsPositionArray);
            passwordArray[numberIndex] =  digit;

            let j = digitsPositionArray.indexOf(numberIndex);
            if(i !== -1) {
              digitsPositionArray.splice(j, 1);
            }
        }

        for (i = 0; i < symbols; i++) {
            var symbol = randomSymbol();
            var symbolIndex = randomDigitPosition(digitsPositionArray);

            passwordArray[symbolIndex] = symbol;
            let j = digitsPositionArray.indexOf(symbolIndex);
            if(i !== -1) {
                digitsPositionArray.splice(j, 1);
            }
        }

        this.setState({
            password: passwordArray.join("")
        }, () => {
            this.checkPasswordStrength();
        })
    }
    handleOnChange = (e, name) => {
        this.setState({
            [name]: e.target.value
        }, () => {
            this.generatePassword();
        })
    }

    checkPasswordStrength = () => {
        const { password } = this.state
        var count = {
            excess: 0,
            upperCase: 0,
            numbers: 0,
            symbols: 0
          };
        var weight = {
            excess: 3,
            upperCase: 4,
            numbers: 5,
            symbols: 5,
            combo: 0,
            flatLower: 0,
            flatNumber: 0
        };

        var baseScore = 30;
        for (var i=0; i < password.length;i++){
            if (password.charAt(i).match(/[A-Z]/g)) {count.upperCase++;}
            if (password.charAt(i).match(/[0-9]/g)) {count.numbers++;}
            if (password.charAt(i).match(/(.*[!,@,#,$,%,^,&,*,?,_,~])/)) {count.symbols++;}
        }

        count.excess = password.length - 6;
        if (count.upperCase && count.numbers && count.symbols){
            weight.combo = 25;
        }else if ((count.upperCase && count.numbers) || (count.upperCase && count.symbols) || (count.numbers && count.symbols)){
          weight.combo = 15;
        }
        if (password.match(/^[\sa-z]+$/))
          {
              weight.flatLower = -30;
        }
        if (password.match(/^[\s0-9]+$/)){
            weight.flatNumber = -50;
        }

        var score =
        baseScore +
        (count.excess * weight.excess) +
        (count.upperCase * weight.upperCase) +
        (count.numbers * weight.numbers) +
        (count.symbols * weight.symbols) +
        weight.combo + weight.flatLower +
        weight.flatNumber;

      if(score < 30 ) {
        this.setState({
            strengthScore: 10,
            strengthText: 'weak'
        })
      } else if (score >= 30 && score < 75 ){
        this.setState({
            strengthScore: 40,
            strengthText: 'average'
        })
      } else if (score >= 75 && score < 150 ){
        this.setState({
            strengthScore: 75,
            strengthText: 'strong'
        })
      } else {
        this.setState({
            strengthScore: 100,
            strengthText: 'secure'
        })
      }
    }
    lengthThumbPosition = () => {
        return (( (this.state.length - 6) / (this.state.settings.maxLength - 6)) * 100);
    }
    digitsThumbPosition = () => {
        return (( (this.state.digits - 0) / (this.state.settings.maxDigits - 0)) * 100);
    }
    symbolsThumbPosition = () => {
        return (( (this.state.symbols - 0) / (this.state.settings.maxSymbols - 0)) * 100);
    }
    copyToClipboard = () => {
        var copyText = document.getElementById("pwd_spn");
        var textArea = document.createElement("textarea");
        textArea.value = copyText.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        this.setState({
            copy: true
        })
        setTimeout(() => {
            this.setState({
                copy: false
            })
        }, 900);
    }
    render(){
        const { password, length, digits, symbols, strengthScore, strengthText, copy } = this.state
        const { maxLength, maxDigits, maxSymbols } = this.state.settings
        const strengthFilled = "range-slider_wrapper slider-strength " + strengthText
        const copyValue = this.state.copy ? 'Copied!' : 'Copy'
        return(
            <div>
                <div className='password-box'>
                    <span id="pwd_spn" ref={() => this.textArea = password} ref={this.textAreaRef} className="password">{password}</span>
                    <span
                        class="regenerate-password"
                        onClick={this.generatePassword}
                    >
                    </span>
                    {
                        <button id="copy_btn" onClick={this.copyToClipboard} class="copy-password">{copyValue}</button>
                    }
                </div>
                <div className="field-wrap">
                    <label>Strength</label>
                    <span className="range-value">{strengthText}</span>
                    <div className={strengthFilled}>
                        <span className="slider-bar" style={{width: `${strengthScore}`+'%'}}></span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="range-slider"
                            disabled="disabled"
                            value={strengthScore}
                        />
                    </div>
                </div>
                <div className="seperator"></div>
                <div className="field-wrap">
                    <label>Length</label>
                    <span className="range-value">{length}</span>
                    <div className="range-slider_wrapper">
                        <span className="slider-bar" style={{width: this.lengthThumbPosition()+'%'}}></span>
                        <input
                            id="length"
                            type="range"
                            min="6"
                            className="range-slider"
                            max={maxLength}
                            value={length}
                            onChange={(e) => this.handleOnChange(e, 'length')}
                        />
                    </div>
                </div>
                <div className="field-wrap">
                    <label>Digits</label>
                    <span className="range-value">{digits}</span>
                    <div className="range-slider_wrapper">
                        <span class="slider-bar" style={{width: this.digitsThumbPosition()+'%'}}></span>
                        <input
                            id="digits"
                            type="range"
                            min="0"
                            className="range-slider"
                            max={maxDigits}
                            value={digits}
                            onChange={(e) => this.handleOnChange(e, 'digits')}
                        />
                    </div>
                </div>
                <div className="field-wrap">
                    <label>Symbols</label>
                    <span className="range-value">{symbols}</span>
                    <div className="range-slider_wrapper">
                        <span class="slider-bar" style={{width: this.symbolsThumbPosition()+'%'}}></span>
                        <input
                            id="symbols"
                            type="range"
                            min="0"
                            className="range-slider"
                            max={maxSymbols}
                            value={symbols}
                            onChange={(e) => this.handleOnChange(e, 'symbols')}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default PasswordGenerator;