import React from 'react';
import ReactDOM from 'react-dom';
import Pokedex from './Pokedex';
import './index.css'; // Assure-toi d'avoir le bon chemin vers ton fichier CSS

ReactDOM.render(
  <React.StrictMode>
    <Pokedex />
  </React.StrictMode>,
  document.getElementById('root')
);
