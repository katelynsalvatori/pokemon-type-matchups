import React, { Component } from 'react';
import './App.css';

export type Header = 'Super Effective' | 'Not Very Effective' | 'No Effect';

export type PokemonType = 'normal' 
  | 'flying' 
  | 'bug' 
  | 'grass' 
  | 'fire' 
  | 'water' 
  | 'ice'
  | 'electric'
  | 'psychic'
  | 'ghost'
  | 'poison'
  | 'fighting'
  | 'rock'
  | 'ground'
  | 'dark'
  | 'steel'
  | 'fairy'
  | 'dragon';

type Props = {|
  header: Header,
  name: string,
  typeList: Array<PokemonType>,
|};

type State = {};

class PokemonList extends Component<Props, State> {

  render() {
    const { header, name, typeList } = this.props;
    return (
      <React.Fragment>
        <h3>{header} Against {name}</h3>
        <ul>
          {typeList.map(function(type, index){
            return <li key={ index }>{type}</li>;
          })}
        </ul>
      </React.Fragment>
    );
  }
}

export default PokemonList