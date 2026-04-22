import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import "./App.css";

function App() {
 const [pokemon, setPokemon] = useState(null);
 const [nombre, setNombre] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 const [lista, setLista] = useState([]);
 const [loadingLista, setLoadingLista] = useState(false);

 const [tipoFiltro, setTipoFiltro] = useState("nombre");
 const [tipoSeleccionado, setTipoSeleccionado] = useState("fire");

 const buscarPokemon = async () => {
   if (!nombre) {
     setError("Escribí algo");
     return;
   }

   setLoading(true);
   setError("");

   try {
     const res = await fetch(
       `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`
     );

     if (!res.ok) {
       throw new Error("No existe ese Pokémon");
     }

     const data = await res.json();
     setPokemon(data);
   } catch (err) {
     setError(err.message);
     setPokemon(null);
   } finally {
     setTimeout(() => {
       setLoading(false);
     }, 1500);
   }
 };

 const obtenerLista = async () => {
   setLoadingLista(true);

   try {
     const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
     const data = await res.json();

     const detalles = await Promise.all(
       data.results.map(async (p) => {
         const res2 = await fetch(p.url);
         return await res2.json();
       })
     );

     setLista(detalles);
   } catch (error) {
     console.log(error);
   } finally {
     setTimeout(() => {
       setLoadingLista(false);
     }, 1500);
   }
 };

 useEffect(() => {
   obtenerLista();
 }, []);

 return (
   <div className="container">
     <h1>Mini Pokédex</h1>

     <div className="buscador">
       <input
         type="text"
         placeholder="Nombre o ID"
         value={nombre}
         onChange={(e) => setNombre(e.target.value)}
       />
       <button onClick={buscarPokemon}>Buscar</button>
     </div>

     {loading && <p className="loading">Cargando...</p>}
     {error && <p className="error">{error}</p>}

     {pokemon && <PokemonCard data={pokemon} />}

     <h2>Lista de Pokémon</h2>

     <div className="filtros">
       <button onClick={() => setTipoFiltro("nombre")}>Por nombre</button>
       <button onClick={() => setTipoFiltro("tipo")}>Por tipo</button>
     </div>

     {tipoFiltro === "tipo" && (
       <select onChange={(e) => setTipoSeleccionado(e.target.value)}>
         <option value="fire">fire</option>
         <option value="water">water</option>
         <option value="grass">grass</option>
         <option value="bug">bug</option>
         <option value="poison">poison</option>
       </select>
     )}

     {loadingLista && <p className="loading">Cargando lista...</p>}

     <div className="grid">
       {lista
         .filter((p) => {
           if (tipoFiltro === "nombre") return true;
           return p.types.some(
             (t) => t.type.name === tipoSeleccionado
           );
         })
         .sort((a, b) => {
           if (tipoFiltro === "nombre") {
             return a.name.localeCompare(b.name);
           }
           return 0;
         })
         .map((p) => (
           <PokemonCard key={p.id} data={p} />
         ))}
     </div>
   </div>
 );
}

export default App;