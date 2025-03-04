# Pokemon Frontend

A React application for managing Pokemon data with features to view, add, and update Pokemon.

## Technologies Used

- **NextJS** - React Framework for building user interfaces
- **TypeScript** - Static type-checking for JavaScript
- **React Context API** - State management
- **React Hooks** - For functional component state and lifecycle features
- **Toast Notifications** - User feedback system
- **REST API Integration** - For Pokemon data management

## Prerequisites

- Node.js (v22.x or later recommended)
- npm or yarn

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/pokemon-frontend.git
cd pokemon-frontend
npm install
```

Or if you use yarn:

```bash
git clone https://github.com/yourusername/pokemon-frontend.git
cd pokemon-frontend
yarn
```

## Running the Project

Start the development server:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

The application will be available at [http://localhost:3001](http://localhost:3001).

## Features

- View a list of Pokemon
- View detailed information for a specific Pokemon
- Add new Pokemon to the collection
- Update existing Pokemon
- Error handling with user-friendly notifications

## Project Structure

- `src/context` - Contains React Context for state management
- `src/api` - API service for Pokemon data operations
- `src/components` - Reusable React components
- `src/pages` - Main application pages/routes

## API Integration

The application connects to a backend Pokemon API with the following endpoints:

- GET /pokemon - Fetch all Pokemon
- GET /pokemon/:id - Fetch a specific Pokemon
- POST /pokemon - Create a new Pokemon
- PUT /pokemon/:id - Update an existing Pokemon
