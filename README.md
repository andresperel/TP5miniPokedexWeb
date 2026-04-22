# Mini Pokédex Web (React + Vite)

Aplicación web desarrollada con React para consumir la API pública [PokéAPI](https://pokeapi.co/), cumpliendo la consigna de:

- entender el funcionamiento de una API REST,
- investigar documentación técnica,
- consumir endpoints desde React,
- transformar JSON en una interfaz visual.

## Endpoints utilizados

1. **Obtener un Pokémon por nombre o ID**
   - `GET https://pokeapi.co/api/v2/pokemon/{nameOrId}`
   - Ejemplos:
     - `/pokemon/pikachu`
     - `/pokemon/25`

2. **Obtener una lista limitada de Pokémon**
   - `GET https://pokeapi.co/api/v2/pokemon?limit=151`

3. **Obtener información de un tipo específico**
   - `GET https://pokeapi.co/api/v2/type/{typeName}`
   - Ejemplo: `/type/fire`

4. **Generar error intencional (recurso inexistente)**
   - `GET https://pokeapi.co/api/v2/pokemon/no-existe-123456`
   - Se espera respuesta HTTP 404 para validar el manejo de errores.

## Funcionalidades implementadas

- Búsqueda de Pokémon por **nombre o ID**.
- Visualización de:
  - Nombre
  - Imagen
  - Tipo(s)
  - Peso
  - Altura
- Manejo de errores cuando el Pokémon no existe o falla una petición.
- Indicadores de **loading** durante peticiones.
- Lista de Pokémon con filtros por:
  - nombre
  - tipo
- Botón para disparar un **error intencional** y comprobar el flujo de errores.

## Requisitos técnicos cubiertos

- Uso de `fetch` para consumir endpoints.
- Manejo de promesas con:
  - `async/await`
  - `then/catch` (en la prueba de error intencional)
- Manipulación dinámica del DOM mediante estado de React (`useState`, `useEffect`, `useMemo`).
- Validación básica de input (nombre/ID válido con regex).
- Manejo de errores en cada petición.
- Código organizado en funciones reutilizables.

## Estructura del proyecto

```text
TP5MINIPOKEDEXWEB/
├── public/
├── src/
│   ├── App.jsx      # Lógica principal, fetch, estados y render
│   ├── App.css      # Estilos de la app
│   ├── main.jsx     # Punto de entrada React
│   └── index.css    # Estilos base globales
├── package.json
└── README.md
```

## Decisiones tomadas

- Separar las peticiones en funciones (`fetchPokemonByNameOrId`, `fetchPokemonList`, `fetchTypeInfo`) para mejorar legibilidad.
- Cargar una lista base limitada a 151 Pokémon para mantener tiempos de carga razonables.
- Filtrar por tipo consultando el endpoint `/type/{typeName}` y cruzando resultados por nombre.
- Mostrar mensajes claros de error y loading en cada bloque funcional.

## Dificultades encontradas

- **Cruce de datos por tipo**: el endpoint de tipos devuelve una estructura distinta a la de listado general; se resolvió normalizando por nombre.
- **Control de estados simultáneos**: búsqueda individual, carga de lista y carga por tipo pueden coexistir; se separaron estados de loading y error por sección.
- **Validación de entrada**: fue necesario prevenir búsquedas vacías o con caracteres inválidos para evitar requests innecesarios.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```
