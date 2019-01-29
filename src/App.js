import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {value: '', error: null, items: [], submitted: ''};

    this.apiUrl = "http://pokeapi.co/api/v2/";
    this.pokemonUrl = this.apiUrl + "pokemon/";
    this.typeUrl = this.apiUrl + "type/";

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({submitted: this.state.value});
    alert('A name was submitted: ' + this.state.value);
    this.findTypeMatchups();
  }

  findTypeMatchups() {
    var pokemon = this.state.value.replace(/'/g, "").replace(/\./g, "").replace(/ /g, "-").toLowerCase();
    console.log(this.pokemonUrl + pokemon);
    fetch(this.pokemonUrl + pokemon, {mode: 'cors'})
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
          this.setState({error});
        }
      );
  }

  render() {
    const value = this.state.submitted;
    return (
      <div className="App">
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <label>
            Pokémon name: <br />
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <h1>{value}</h1>
      </div>
    );
  }
}

export default App;
