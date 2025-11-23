# md-backend

<p align="center">
  <img src="https://img.shields.io/badge/Framework-nestjs-blue%3Fstyle%3Dflat" alt="Framework-nestjs"/>
  <img src="https://img.shields.io/badge/Version-0.0.1-purple?style=flat" alt="Version-0.0.1"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat" alt="License-MIT"/>
</p>

## About

A simple server that lets you share Markdown-formatted text via short, shareable links

## Technologies

- NestJS (11.0.0)
- TypeOrm (0.3.27)
- PostgreSQL (16)

## Environment

- Node 24.11.0 (24)
- npm 11.6.2 (11)

## Common setup

Clone the repo and install the dependencies.

```
  git clone https://github.com/evdmatvey/md-backend.git
  cd md-backend
```

```
  npm install
```

### Development

Initialize dev environment (database)

```
  docker compose -f "docker-compose.dev.yml" up -d --build
```

Run in development mode.

```
  npm run start:dev
```

Run tests.

```
  npm run test
```

Run code format checker.

```
  npm run format
```

Run linter.

```
  npm run lint
```

### Build

Build application and start.

```
  npm run build
  npm run start:prod
```

## Developers

- [evdmatvey](https://github.com/evdmatvey)

## License

Project md-backend is distributed under the MIT license.
