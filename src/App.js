import React, { Component } from 'react';
import './index.scss';
import PasswordGenerator from './components/PasswordGenerator'

class App extends Component {
  render() {
    return (
      <section className="wrapper">
        <PasswordGenerator />
      </section>
    );
  }
}

export default App;
