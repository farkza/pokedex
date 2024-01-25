import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import axios from 'axios';
import image_Pokedex from './img/pokedex.png';
import image_Search from './img/search.png';
import US_Flag from './img/united-states.png';
import FR_Flag from './img/france.png';
import filter from './img/filter.png'
import Select from "react-select";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faArrowLeft);

const Pokedex = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [generations, setGenerations] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedGeneration, setSelectedGeneration] = useState('allGenerations');
  const [selectedType, setSelectedType] = useState('allTypes');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedFilter, setSelectedFilter] = useState('id');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setModalVisibility] = useState(false); // État pour la modal
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isShinyImage, setIsShinyImage] = useState(false); // État pour suivre les shiny
  const [evolvedFrom, setEvolvedFrom] = useState(null);
  const [evolvesTo, setEvolvesTo] = useState(null);
  const [language, setLanguage] = useState('fr'); // Par défaut en français 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonResponse = await axios.get('https://pokedex-api.3rgo.tech/api/pokemon');
        const typesResponse = await axios.get('https://pokedex-api.3rgo.tech/api/types');

        if (pokemonResponse.data.success && Array.isArray(pokemonResponse.data.data)) {
          setPokemonList(pokemonResponse.data.data);
          const allGenerations = pokemonResponse.data.data.map((pokemon) => pokemon.generation);
          const uniqueGenerations = Array.from(new Set(allGenerations));
          const generationsOptions = uniqueGenerations.map((generation) => ({
            id: generation,
            name: { fr: `Génération ${generation}` },
          }));
          setGenerations(generationsOptions);
        } else {
          throw new Error('Pokemon data format is incorrect');
        }

        if (typesResponse.data.success && Array.isArray(typesResponse.data.data)) {
          setTypes(typesResponse.data.data);
        } else {
          throw new Error('Type data format is incorrect');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setPokemonList([]);
        setTypes([]);
      }
    };

    fetchData();
  }, []);

  const filteredPokemonList = pokemonList.filter((pokemon) => {
    const generationCondition = selectedGeneration === 'allGenerations' || String(pokemon.generation) === selectedGeneration;
    const typeCondition = selectedType === 'allTypes' || pokemon.types.includes(Number(selectedType));
    const searchCondition = searchTerm === '' || pokemon.name[language].toLowerCase().includes(searchTerm.toLowerCase());

    return generationCondition && typeCondition && searchCondition;
  });

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
  };

  const changeFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const resetFilters = () => {
    setSelectedGeneration('allGenerations');
    setSelectedType('allTypes');
    setSelectedFilter('id');
    setSortOrder('asc');
  };

  const getBackgroundColorClass = () => {
    const firstTypeId = selectedPokemon.types[0];
    const firstTypeInfo = types.find(type => type.id === firstTypeId);
    return firstTypeInfo ? firstTypeInfo.name.en.toLowerCase() : '';
  };

  const handleCardClick = (selectedPokemon) => {
    setSelectedPokemon(selectedPokemon);
    setModalVisibility(true);
    setIsShinyImage(false);

    // Vérifie s'il y a une évolution antérieure pour le Pokémon
    if (selectedPokemon.evolvedFrom) {
      const evolutionFromKeys = Object.keys(selectedPokemon.evolvedFrom);
      const evolvedFromData = evolutionFromKeys.map((evolutionKey) => ({
        id: evolutionKey,
        level: selectedPokemon.evolvedFrom[evolutionKey],
      }));

      setEvolvedFrom(evolvedFromData);
    } else {
      setEvolvedFrom(null);
    }

    // Vérifie s'il y a des évolutions futures pour le Pokémon
    if (selectedPokemon.evolvesTo) {
      const evolutionToKeys = Object.keys(selectedPokemon.evolvesTo);
      const evolvesToData = evolutionToKeys.map((evolutionKey) => ({
        id: evolutionKey,
        level: selectedPokemon.evolvesTo[evolutionKey],
      }));

      setEvolvesTo(evolvesToData);
    } else {
      setEvolvesTo(null);
    }
  };

  // Bascule à l'image shiny
  const toggleShinyImage = () => {
    setIsShinyImage(!isShinyImage);
  };

  // Repasse la visibilité de la Modal à false
  const closeModal = () => {
    setModalVisibility(false);
  };

  // Change la langue
  const changeLanguage = () => {
  const newLanguage = language === 'fr' ? 'en' : 'fr'; // Bascule entre français et anglais
  setLanguage(newLanguage);
  };

  // Traduit les statistiques des pokémons
  const statTranslations = {
    hp: { fr: 'pv', en: 'hp' },
    atk: { fr: 'atq', en: 'atk' },
    def: { fr: 'def', en: 'def' },
    vit: { fr: 'vit', en: 'spd' },
    spe_atk: { fr: 'atq_spe', en: 'sp. atk' },
    spe_def: { fr: 'def_spe', en: 'sp. def' },
  };

  const sortedPokemonList = [...filteredPokemonList].sort((a, b) => {
    switch (selectedFilter) {
      case 'id':
        return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
      case 'name':
        return sortOrder === 'asc' ? a.name.fr.localeCompare(b.name[language]) : b.name.fr.localeCompare(a.name[language]);
      case 'weight':
        return sortOrder === 'asc' ? a.weight - b.weight : b.weight - a.weight;
      case 'height':
        return sortOrder === 'asc' ? a.height - b.height : b.height - a.height;
      default:
        return 0;
    }
  });

  return (
    <div>
      <div className="header">
        <img src={image_Pokedex} alt="Pokedex Logo" />
        <p className="HeadText">{language === 'fr' ? 'Recherchez des Pokémon par nom ou en utilisant le filtre' : 'Search for Pokémon by name or using the filter'}</p>
      </div>

      <div className="filters-container">
        <Select
          className="selected_Generation"
          value={{ label: language === 'fr' ? 'Toutes les générations' : 'All generations', value: selectedGeneration }}
          options={[{ label: language === 'fr' ? 'Toutes les générations' : 'All generations', value: 'allGenerations' }, ...generations.map(generation => ({ label: generation.name[language], value: String(generation.id) }))]}
          onChange={(selectedOption) => setSelectedGeneration(selectedOption.value)}
        />

        <Select
          className="selected_Type"
          value={{ label: language === 'fr' ? 'Tous les types' : 'All types', value: 'allTypes' }}
          options={[{ label: language === 'fr' ? 'Tous les types' : 'All types', value: 'allTypes' }, ...types.map(type => ({ label: type.name[language], value: type.id }))]}
          onChange={(selectedOption) => setSelectedType(selectedOption.value)}
        />

        <div class="dropdown">
          <img src={filter} alt="Drapeau" id="dropdownBtn" className="dropdown-btn" />
          <div class="dropdown-content" id="dropdownContent">
            <button onClick={toggleSortOrder}>
              {sortOrder === 'asc' ? (language === 'fr' ? 'Tri croissant' : 'Ascending order') : (language === 'fr' ? 'Tri décroissant' : 'Descending order')}
            </button>
            <button onClick={() => changeFilter('id')}>{language === 'fr' ? 'Filtrer par numéro' : 'Filter by number'}</button>
            <button onClick={() => changeFilter('name')}>{language === 'fr' ? 'Filtrer par ordre alphabétique' : 'Filter by alphabetical order'}</button>
            <button onClick={() => changeFilter('weight')}>{language === 'fr' ? 'Filtrer par poids' : 'Filter by weight'}</button>
            <button onClick={() => changeFilter('height')}>{language === 'fr' ? 'Filtrer par taille' : 'Filter by height'}</button>
          </div>
        </div>

        <button onClick={resetFilters} className='resetFilters'>{language === 'fr' ? 'Réinitialiser les filtres' : 'Reset filters'}</button>
        <div className="input-search">
        <img className="search-button" src={image_Search} alt="Search Logo" />
        <input type="text" placeholder={language === 'fr' ? 'Rechercher un Pokémon' : 'Search for a Pokemon'}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        <img
          src={language === 'fr' ? US_Flag : FR_Flag}
          alt={language === 'fr' ? 'Drapeau anglais' : 'Drapeau français'}
          onClick={changeLanguage}
          className="flag_img"
          style={{ cursor: 'pointer' }}
        />
      </div>

      <div className="pokedex-container">
        {sortedPokemonList.length > 0 ? (
          sortedPokemonList.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              typesData={types}
              onClick={handleCardClick} // Passer la fonction handleCardClick
              language={language} // Passer la langue en tant que prop
            />
          ))
        ) : (
          <p>No Pokemon found</p>
        )}
      </div>

      {isModalVisible && selectedPokemon && (
      <div className='modal-overlay'>
        <div className={`modal-content ${getBackgroundColorClass()}`}>
        <button className="back-btn-modal" onClick={closeModal}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

          <div className='header-modal'>
              <img
                src={isShinyImage ? selectedPokemon.image_shiny : selectedPokemon.image}
                alt={selectedPokemon.name && selectedPokemon.name[language]}
                onClick={toggleShinyImage} // Appel de la fonction pour basculer l'image
                className='modalPokemonImg'
              />
            
            <div className='ModalPokemonInfos'>
              <div>
                <p className='pokemon-id-modal'>#{selectedPokemon.id}</p>
              </div>
              <div>
                <p className='pokemon-name-modal'>{selectedPokemon.name && selectedPokemon.name[language]}</p>
              </div>
              
              <div>
                {/* Vérifie d'abord si selectedPokemon.types existe avant de mapper */}
                {selectedPokemon.types && selectedPokemon.types.length > 0 && (
                  <div className='type-modal-container'>
                    {selectedPokemon.types.map(typeId => {
                      const type = types.find(type => type.id === typeId);
                      return (
                        type && (
                          <div key={type.id} className="type-container">
                            <img className='type-img' src={type.image} alt={type.name[language]} />
                            <p>{type.name[language]}</p>
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

          </div>

          <div>
            <div className="infos-pokemon-body">
              <p>{language === 'fr' ? 'Taille' : 'Height'}: {selectedPokemon.height} m</p>
              <p>{language === 'fr' ? 'Poids' : 'Weight'}: {selectedPokemon.weight} kg</p>
            </div>

            <div className="stats-pokemon">
              <p>{language === 'fr' ? 'Statistiques' : 'Stats'}:</p>
              <ul>
                {Object.entries(selectedPokemon.stats).map(([stat, value]) => (
                  <li key={stat}>
                    {statTranslations[stat][language]}: {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {evolvedFrom && evolvedFrom.length > 0 && (
            <div className="evolution-section">
              <h3>{language === 'fr' ? 'Evolutions précédentes' : 'Previous evolutions'}:</h3>
              <div className="evolution-chain">
                {evolvedFrom.map((evolution) => (
                  <div key={evolution.id}>
                    <img
                      src={`https://raw.githubusercontent.com/Yarkis01/PokeAPI/images/sprites/${evolution.id}/regular.png`}
                      alt={`Pokemon ${evolution.id}`}
                      className='modalEvolvedFromPokemonImg'
                    />
                    <p>{evolution.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {evolvesTo && evolvesTo.length > 0 && (
            <div className="evolution-section">
              <h3>{language === 'fr' ? 'Evolutions futures' : 'Future evolutions'}:</h3>
              <div className="evolution-chain">
                {evolvesTo.map((evolution) => (
                  <div key={evolution.id}>
                    <img
                      src={`https://raw.githubusercontent.com/Yarkis01/PokeAPI/images/sprites/${evolution.id}/regular.png`}
                      alt={`Pokemon ${evolution.id}`}
                      className='modalEvolvedToPokemonImg'
                    />
                    <p>{evolution.level}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    )}

    </div>
  );
};

export default Pokedex;