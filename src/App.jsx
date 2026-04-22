import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = 'https://pokeapi.co/api/v2'
const DEFAULT_LIMIT = 151

const TYPE_OPTIONS = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
]

const formatNumber = (value) => String(value).padStart(3, '0')
const formatPokemonName = (name) =>
  name
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ')

const getPokemonImage = (pokemon) =>
  pokemon.sprites.other['official-artwork'].front_default ||
  pokemon.sprites.front_default

async function fetchPokemonByNameOrId(query) {
  const response = await fetch(`${API_BASE}/pokemon/${query}`)
  if (!response.ok) {
    throw new Error('No encontramos ese Pokémon. Revisá el nombre o ID.')
  }
  return response.json()
}

async function fetchPokemonList(limit = DEFAULT_LIMIT) {
  const response = await fetch(`${API_BASE}/pokemon?limit=${limit}`)
  if (!response.ok) {
    throw new Error('No se pudo cargar la lista de Pokémon.')
  }
  const data = await response.json()
  return data.results
}

async function fetchTypeInfo(typeName) {
  const response = await fetch(`${API_BASE}/type/${typeName}`)
  if (!response.ok) {
    throw new Error('No pudimos obtener información de ese tipo.')
  }
  return response.json()
}

function App() {
  const [searchValue, setSearchValue] = useState('')
  const [pokemon, setPokemon] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  const [allPokemon, setAllPokemon] = useState([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [listError, setListError] = useState('')

  const [nameFilter, setNameFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [pokemonNamesByType, setPokemonNamesByType] = useState(new Set())
  const [isLoadingType, setIsLoadingType] = useState(false)

  const [endpointErrorMessage, setEndpointErrorMessage] = useState('')

  useEffect(() => {
    const loadInitialList = async () => {
      try {
        setIsLoadingList(true)
        const list = await fetchPokemonList()
        setAllPokemon(list)
        setListError('')
      } catch (error) {
        setListError(error.message)
      } finally {
        setIsLoadingList(false)
      }
    }

    loadInitialList()
  }, [])

  useEffect(() => {
    if (!typeFilter) {
      setPokemonNamesByType(new Set())
      return
    }

    const loadTypeData = async () => {
      try {
        setIsLoadingType(true)
        const typeData = await fetchTypeInfo(typeFilter)
        const names = typeData.pokemon.map((entry) => entry.pokemon.name)
        setPokemonNamesByType(new Set(names))
        setListError('')
      } catch (error) {
        setListError(error.message)
        setPokemonNamesByType(new Set())
      } finally {
        setIsLoadingType(false)
      }
    }

    loadTypeData()
  }, [typeFilter])

  const filteredPokemonList = useMemo(() => {
    const normalizedName = nameFilter.trim().toLowerCase()

    return allPokemon.filter((item) => {
      const matchesName = item.name.includes(normalizedName)
      const matchesType =
        !typeFilter || pokemonNamesByType.size === 0 || pokemonNamesByType.has(item.name)

      return matchesName && matchesType
    })
  }, [allPokemon, nameFilter, typeFilter, pokemonNamesByType])

  const handleSearchSubmit = async (event) => {
    event.preventDefault()

    const normalized = searchValue.trim().toLowerCase()
    const isValid = /^[a-z0-9-]+$/i.test(normalized)

    if (!normalized || !isValid) {
      setSearchError('Ingresá un nombre o ID válido (solo letras, números o guión).')
      setPokemon(null)
      return
    }

    try {
      setIsSearching(true)
      setSearchError('')
      const result = await fetchPokemonByNameOrId(normalized)
      setPokemon(result)
    } catch (error) {
      setPokemon(null)
      setSearchError(error.message)
    } finally {
      setIsSearching(false)
    }
  }

  const handleIntentionalError = () => {
    setEndpointErrorMessage('')

    fetch(`${API_BASE}/pokemon/no-existe-123456`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error intencional generado correctamente: HTTP ${response.status} en /pokemon/no-existe-123456`,
          )
        }
        return response.json()
      })
      .then(() => {
        setEndpointErrorMessage('No se produjo el error esperado (esto no debería pasar).')
      })
      .catch((error) => {
        setEndpointErrorMessage(error.message)
      })
  }

  return (
    <main className="app-shell">
      <header>
        <h1>Mini Pokédex Web</h1>
        <p>Consumo de API pública con React + fetch (PokéAPI)</p>
      </header>

      <section className="card">
        <h2>Buscar Pokémon por nombre o ID</h2>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Ej: pikachu o 25"
            aria-label="Buscar Pokémon"
          />
          <button type="submit" disabled={isSearching}>
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {isSearching && <p className="status">Cargando información del Pokémon...</p>}
        {searchError && <p className="error">{searchError}</p>}

        {pokemon && (
          <article className="pokemon-card">
            <img src={getPokemonImage(pokemon)} alt={pokemon.name} />
            <div>
              <h3>
                {formatPokemonName(pokemon.name)} #{formatNumber(pokemon.id)}
              </h3>
              <p>
                <strong>Tipo(s):</strong>{' '}
                {pokemon.types.map((item) => formatPokemonName(item.type.name)).join(', ')}
              </p>
              <p>
                <strong>Peso:</strong> {pokemon.weight}
              </p>
              <p>
                <strong>Altura:</strong> {pokemon.height}
              </p>
            </div>
          </article>
        )}
      </section>

      <section className="card">
        <h2>Lista de Pokémon con filtros</h2>
        <div className="filters">
          <input
            type="text"
            value={nameFilter}
            placeholder="Filtrar por nombre"
            onChange={(event) => setNameFilter(event.target.value.toLowerCase())}
          />

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filtrar por tipo"
          >
            <option value="">Todos los tipos</option>
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {formatPokemonName(type)}
              </option>
            ))}
          </select>
        </div>

        {(isLoadingList || isLoadingType) && (
          <p className="status">Cargando lista y/o datos del tipo seleccionado...</p>
        )}
        {listError && <p className="error">{listError}</p>}

        {!isLoadingList && !listError && (
          <ul className="pokemon-list">
            {filteredPokemonList.map((item) => (
              <li key={item.name}>{formatPokemonName(item.name)}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Prueba de error intencional</h2>
        <p>
          Botón para probar un endpoint inexistente y verificar el manejo de errores.
        </p>
        <button type="button" onClick={handleIntentionalError}>
          Generar error intencional
        </button>
        {endpointErrorMessage && <p className="status">{endpointErrorMessage}</p>}
      </section>
    </main>
  )
}

export default App
