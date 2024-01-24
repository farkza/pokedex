import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [filterGeneration, setFilterGeneration] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch('https://pokedex-api.3rgo.tech/pokemon')
      .then(response => response.json())
      .then(data => setPokemonList(data))
      .catch(error => console.log(error));
  }, []);

  const filteredPokemonList = pokemonList.filter(pokemon => {
    if (filterGeneration && pokemon.generation !== filterGeneration) return false;
    if (filterType && !pokemon.types.includes(filterType)) return false;

    return pokemon.name.toLowerCase().includes(searchText.toLowerCase());
  });

  const displayPokemonDetails = (pokemon) => {

    setSelectedPokemon(pokemon); 
  };

  return (
    <div className="App">
      <div>
        <select onChange={(e) => setFilterGeneration(e.target.value)}>
        </select>

        <select onChange={(e) => setFilterType(e.target.value)}>
        </select>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        onChange={(e) => setSearchText(e.target.value)}
      />

      {filteredPokemonList.map((pokemon) => (
        <div key={pokemon.id}>
          <p>{pokemon.number}</p>
          <p>{pokemon.name}</p>
          <img src={pokemon.image} alt={pokemon.name} />
          <button onClick={() => displayPokemonDetails(pokemon)}>
            View Details
          </button>
        </div>
      ))}
      {selectedPokemon && (
        <div>
          <p>{selectedPokemon.number}</p>
          <p>{selectedPokemon.name}</p>
        </div>
      )}

    </div>
  );
}

export default App;
