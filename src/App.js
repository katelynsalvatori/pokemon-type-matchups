import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      error: null,
      submitted: '',
      types: [],
      relationships: [],
      superEffective: [],
      notVeryEffective: [],
      noEffect: []
    };

    this.apiUrl = "http://pokeapi.co/api/v2/";
    this.pokemonUrl = this.apiUrl + "pokemon/";
    this.typeUrl = this.apiUrl + "type/";
    this.fetchMode = {mode: 'cors'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({submitted: this.state.value});
    this.getTypes();
  }

  getTypes() {
    var pokemon = this.state.value.replace(/'/g, "").replace(/\./g, "").replace(/ /g, "-").toLowerCase();
    console.log(this.pokemonUrl + pokemon);
    fetch(this.pokemonUrl + pokemon, this.fetchMode)
      .then(res => res.json())
      .then(
        (result) => {
          var types = result.types.map((x) => x.type.name);
          this.setState({types});
          this.getTypeRelations(types);
        },
        (error) => {
          console.log(error);
          this.setState({error});
        }
      );
  }

  getTypeRelations(types) {
    var relationships = {};

    for (var i = 0; i < types.length; i++) {
      var currType = types[i];
      fetch(this.typeUrl + currType, this.fetchMode)
        .then(res => res.json())
        .then(
          (result) => {
            var halfDmg = result.damage_relations.half_damage_from.map((x) => x.name);
            relationships = this.calculateRelations(relationships, halfDmg, 0.5, currType);

            var dblDmg = result.damage_relations.double_damage_from.map((x) => x.name);
            relationships = this.calculateRelations(relationships, dblDmg, 2.0, currType);

            var noDmg = result.damage_relations.no_damage_from.map((x) => x.name);
            relationships = this.calculateRelations(relationships, noDmg, 0.0, currType);

            var superEffective = Object.keys(relationships).filter((x) => relationships[x] > 1.0);
            var notVeryEffective = Object.keys(relationships).filter((x) => relationships[x] < 1.0 && relationships[x] > 0.0);
            var noEffect = Object.keys(relationships).filter((x) => relationships[x] === 0.0);
            this.setState({superEffective, notVeryEffective, noEffect, relationships});
          },
          (error) => {
            console.log(error);
            this.setState({error});
          }
        );
    }
  }

  calculateRelations(relationships, damageFromTypes, multiplier) {
    for (var i = 0; i < damageFromTypes.length; i++) {
      var currType = damageFromTypes[i];
      if (currType in relationships) {
        relationships[currType] *= multiplier;
      }
      else {
        relationships[currType] = multiplier;
      }
    }

    return relationships;
  }

  render() {
    const name = this.state.submitted;
    const types = this.state.types;
    const relationships = this.state.relationships;
    const superEffective = this.state.superEffective;
    const notVeryEffective = this.state.notVeryEffective;
    const noEffect = this.state.noEffect;

    let body;

    if (Object.keys(relationships).length > 0) {
      body = (
        <div>
          <h3>Super Effective</h3>
          <ul>
            {superEffective.map(function(type, index){
              return <li key={ index }>{type}</li>;
            })}
          </ul>
          <h3>Not Very Effective</h3>
          <ul>
            {notVeryEffective.map(function(type, index){
              return <li key={ index }>{type}</li>;
            })}
          </ul>
          <h3>No Effect</h3>
          <ul>
            {noEffect.map(function(type, index){
              return <li key={ index }>{type}</li>;
            })}
          </ul>
          </div>
      );
    }

    return (
      <div className="App">
        <form autoComplete="off" onSubmit={this.handleSubmit}>
          <label>
            <h2>Pokémon name:</h2>
            <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <div>
          <h2>{name}</h2>
          <ul>
            {types.map(function(type, index){
              return <li key={ index }>{type}</li>;
            })}
          </ul>
          {body}
        </div>
      </div>
    );
  }
}

export default App;
