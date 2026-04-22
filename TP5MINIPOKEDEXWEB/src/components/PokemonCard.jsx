function PokemonCard({ data }) {
  return (
    <div className="card">
      <h3>{data.name}</h3>

      <img
        src={
          data.sprites?.other?.["official-artwork"]?.front_default ||
          data.sprites?.front_default
        }
        alt={data.name}
      />

      <p>Tipo: {data.types.map((t) => t.type.name).join(", ")}</p>
      <p>Peso: {data.weight}</p>
      <p>Altura: {data.height}</p>
    </div>
  );
}

export default PokemonCard;