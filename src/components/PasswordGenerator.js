import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {LETTERS, SYMBOLS} from '../constants'

function PasswordGenerator(props){
    const [password, setPassword] = useState('')
    const [length, setLength] = useState(props.length)
    const [digitCount, setDigitCount] = useState(props.digitCount)
    const [symbolCount, setSymbolCount] = useState(props.symbolCount)
    const [copy, setCopy] = useState(false)
    const [strengthScore, setStrengthScore] = useState(0)
    const [strengthText, setStrengthText] = useState('')
    const [settings, setSettings] = useState({
        maxLength: props.maxLength,
        maxDigits: props.maxDigits,
        maxSymbols: props.maxSymbols,
    })
    useEffect(() => {
        document.getElementById("copy_btn").addEventListener("click", copyToClipboard);
        return () => {
            document.getElementById("copy_btn").removeEventListener("click", copyToClipboard);
        }
    }, [])
    useEffect(() => {
        generatePassword()
        checkPasswordStrength()
    },[length, digitCount, symbolCount])
    const generatePassword = () => {
        let passwordArray = [];
        let digitsPositionArray = [];
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
        for(i=0; i < digitCount; i++){
            var digit = Math.round(Math.random() * 9);
            var numberIndex = randomDigitPosition(digitsPositionArray);
            passwordArray[numberIndex] =  digit;

            let j = digitsPositionArray.indexOf(numberIndex);
            if(i !== -1) {
              digitsPositionArray.splice(j, 1);
            }
        }
        for (i = 0; i < symbolCount; i++) {
            var symbol = randomSymbol();
            var symbolIndex = randomDigitPosition(digitsPositionArray);

            passwordArray[symbolIndex] = symbol;
            let j = digitsPositionArray.indexOf(symbolIndex);
            if(i !== -1) {
                digitsPositionArray.splice(j, 1);
            }
        }
        setPassword(passwordArray.join(""))
    }
    const handleOnChange = (e, name) => {
        let value = e.target.value
        if(name === 'length'){
            setLength(value)
        }else if(name === 'digits'){
            setDigitCount(value)
        }else if(name === 'symbols'){
            setSymbolCount(value)
        }
    }
    const checkPasswordStrength = () => {
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
        setStrengthScore(10)
        setStrengthText('weak')
      }else if (score >= 30 && score < 75 ){
        setStrengthScore(40)
        setStrengthText('average')
      }else if (score >= 75 && score < 150 ){
        setStrengthScore(75)
        setStrengthText('average')
      }else {
        setStrengthScore(100)
        setStrengthText('secure')
      }
    }
    const lengthThumbPosition = () => {
        return (( (length - 6) / (settings.maxLength - 6)) * 100);
    }
    const digitsThumbPosition = () => {
        return (( (digitCount - 0) / (settings.maxDigits - 0)) * 100);
    }
    const symbolsThumbPosition = () => {
        return (( (symbolCount - 0) / (settings.maxSymbols - 0)) * 100);
    }
    const copyToClipboard = () => {
        var copyText = document.getElementById("pwd_spn");
        var textArea = document.createElement("textarea");
        textArea.value = copyText.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();
        setCopy(true)
        setTimeout(() => {
            setCopy(false)
        }, 900);
    }
    const { maxLength, maxDigits, maxSymbols } = settings
    const strengthFilled = "range-slider_wrapper slider-strength " + strengthText
    const copyValue = copy ? 'Copied!' : 'Copy'
    return(
        <div>
            <div className='password-box'>
                <span id="pwd_spn" className="password">{password}</span>
                <span
                    class="regenerate-password"
                    onClick={generatePassword}
                >
                </span>
                {
                    <button id="copy_btn" onClick={copyToClipboard} class="copy-password">{copyValue}</button>
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
                    <span className="slider-bar" style={{width: lengthThumbPosition()+'%'}}></span>
                    <input
                        id="length"
                        type="range"
                        min="6"
                        className="range-slider"
                        max={maxLength}
                        value={length}
                        onChange={(e) => handleOnChange(e, 'length')}
                    />
                </div>
            </div>
            <div className="field-wrap">
                <label>Digits</label>
                <span className="range-value">{digitCount}</span>
                <div className="range-slider_wrapper">
                    <span class="slider-bar" style={{width: digitsThumbPosition()+'%'}}></span>
                    <input
                        id="digits"
                        type="range"
                        min="0"
                        className="range-slider"
                        max={maxDigits}
                        value={digitCount}
                        onChange={(e) => handleOnChange(e, 'digits')}
                    />
                </div>
            </div>
            <div className="field-wrap">
                <label>Symbols</label>
                <span className="range-value">{symbolCount}</span>
                <div className="range-slider_wrapper">
                    <span class="slider-bar" style={{width: symbolsThumbPosition()+'%'}}></span>
                    <input
                        id="symbols"
                        type="range"
                        min="0"
                        className="range-slider"
                        max={maxSymbols}
                        value={symbolCount}
                        onChange={(e) => handleOnChange(e, 'symbols')}
                    />
                </div>
            </div>
        </div>
    )
}

function randomLetter(){
    return LETTERS[Math.floor(Math.random()*LETTERS.length)]
}
function randomDigitPosition(digitsPositionArray){
    return digitsPositionArray[Math.floor(Math.random()*digitsPositionArray.length)]
}
function randomSymbol(){
    return SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)]
}

PasswordGenerator.propTypes = {
    length: PropTypes.number,
    digitCount: PropTypes.number,
    symbolCount: PropTypes.number,
    maxLength: PropTypes.number,
    maxDigits: PropTypes.number,
    maxSymbols: PropTypes.number
}
PasswordGenerator.defaultProps = {
    length: 30,
    digitCount: 15,
    symbolCount: 15,
    maxLength: 60,
    maxDigits: 30,
    maxSymbols: 30
}
export default PasswordGenerator;