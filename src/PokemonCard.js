import './styles/PokemonCard.css';

const PokemonCard = ({ pokemon, typesData, onClick, language}) => {
  const getTypeInfo = (typeId) => {
    const type = typesData.find((t) => t.id === typeId);
    return type ? type : null;
  };

  const formatPokemonId = (id) => {
    const paddedId = `000${id}`.slice(-4);
    return `#${paddedId}`;
  };

  const getFirstTypeClassName = () => {
    const firstTypeId = pokemon.types[0];
    const firstTypeInfo = getTypeInfo(firstTypeId);
    return firstTypeInfo ? firstTypeInfo.name.en.toLowerCase() : '';
  };

  const getTypeContainerClassName = (typeId) => {
    const typeInfo = getTypeInfo(typeId);
    return typeInfo ? typeInfo.name.en.toLowerCase() : '';
  };

  const handleCardClick = () => {
    onClick(pokemon); 
  };

  return (
    <div className={`pokemon-card ${getFirstTypeClassName()}`} onClick={handleCardClick}>
      <div className="pokemon-details">
        <div className="generation-number">{pokemon.generation}</div>
        <p className="pokemon-id">{formatPokemonId(pokemon.id)}</p>
        <p className="pokemon-name">{pokemon.name[language]}</p>
        <div className="pokemon-types">
          {pokemon.types.map((typeId) => {
            const typeContainerClassName = getTypeContainerClassName(typeId);
            const typeInfo = getTypeInfo(typeId);
            return (
              typeInfo && (
                <div key={typeId} className="pokemon-type">
                  <div className={`type-container ${typeContainerClassName}`}>
                    <img src={typeInfo.image} alt={typeInfo.name[language]} />
                    <p>{typeInfo.name[language]}</p>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
      <div className="pokemon-image">
        <img src={pokemon.image} alt={pokemon.name[language]} />
      </div>
    </div>
  );
};

export default PokemonCard;
