---
order: 1
---

# Local Development Setup

Use the docker stack — it gives you WP + WP-CLI + Elementor + the plugin bind-mounted.

## Requirements

- Docker Desktop (or compatible)
- Node ≥ 20, npm ≥ 10
- Composer 2

## First-time setup

```bash
git clone git@github.com:wpdevteam/embedpress.git
git clone git@github.com:wpdevteam/embedpress-pro.git
git clone git@github.com:wpdevteam/embedpress-docker.git

cd embedpress-docker
cp .env.example .env
# Edit .env: set PLUGIN_PATH=/Applications/Workspace/GitHub/embedpress (or wherever you cloned)

make setup       # builds containers, installs WP, activates plugin + Elementor
```

WordPress will be running at `http://localhost:8080` with admin / admin.

## Day-to-day

```bash
make up                  # start
make down                # stop
make restart
make logs                # tail
make shell               # bash inside wordpress container
make wp ARG="plugin list"

# JS dev
make npm-install
make npm-start           # vite watch in container
# or run directly on host if you prefer:
cd /path/to/embedpress
npm install
npm run start

# Tests
make test
make test-js / test-js-ui / test-php / test-php-unit / test-php-integration
make lint / lint-fix

# DB
make db-export
make db-import
make db-reset
make seed                # reload seed data
```

## Activating Pro

The docker stack symlinks both plugins (free + pro) into the WP plugins folder. `make setup` activates free. Activate Pro from `wp-admin → Plugins` or:

```bash
make wp ARG="plugin activate embedpress-pro"
```

## Working on JS

`npm run start` (Vite watch) rebuilds on save. The wordpress container bind-mounts the plugin source, so the built files in `assets/` are immediately picked up.

For unminified output during dev, set `define('SCRIPT_DEBUG', true)` in `wp-config.php`.

## Working on PHP

Just edit. PHP is loaded fresh on every request — no restart needed.

## Sample data

`make seed` loads a set of fixtures: posts with each provider, a sample analytics dataset, etc. Use this to smoke-test changes against realistic content.
