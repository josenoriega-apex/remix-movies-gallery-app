# Movies Gallery

A simple application that lets you display a list of movies made for learning purposes with Remix (now React Router).

## Screenshots

<img width="1840" height="1106" alt="Captura de pantalla 2025-09-18 a la(s) 5 57 46 p m" src="https://github.com/user-attachments/assets/8b796aaa-27fe-4538-86e8-47ad3df6c49e" />

## Getting Started

### Installation

Install the dependencies:

```bash
yarn install
```

### Development

Copy `.env.example` to `.env` and provide a `DATABASE_URL` with your connection string.

Run an initial database migration:

```bash
yarn db:migrate
```

Add data to your database:
```bash
yarn db:seed
```

Start the development server with HMR:

```bash
yarn dev
```

Your application will be available at `http://localhost:5173`.


---

Built with ❤️ using React Router.
