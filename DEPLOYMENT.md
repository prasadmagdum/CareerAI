# CareerAI deployment checklist

CareerAI is deployed as two applications: a Vite-built React frontend and a
Django REST API backed by PostgreSQL. The AI features also require a reachable
Ollama service.

## Frontend

1. Set `VITE_API_BASE_URL` to the API base URL, including `/api` (for example,
   `https://api.example.com/api`).
2. Install dependencies with `npm ci`.
3. Build with `npm run build` and publish the `frontend/dist` directory.
4. Configure the static host to serve `index.html` for unknown paths so
   client-side routes such as `/login` and `/analysis` work on refresh.

`frontend/.env.example` shows the local development value. Vite embeds
`VITE_*` variables in the built assets, so never put secrets in frontend
environment variables.

## Backend

Use Python 3.10 or 3.11 and install dependencies from `backend/requirements.txt`.
Provide these environment variables through the hosting provider's secret
configuration (not a committed `.env` file):

| Variable | Production value |
| --- | --- |
| `DEBUG` | `False` |
| `SECRET_KEY` | New, long, random value; rotate the development key currently in the project |
| `ALLOWED_HOSTS` | Comma-separated API host names, without schemes |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST` | PostgreSQL connection details |
| `DB_PORT` | PostgreSQL port, usually `5432` |
| `DB_SSL_REQUIRE` | `True` when required by the database provider |
| `CORS_ALLOWED_ORIGINS` | Exact frontend origins, including `https://` |
| `CSRF_TRUSTED_ORIGINS` | Exact trusted HTTPS origins |
| `OLLAMA_HOST` | Private/reachable Ollama service URL |
| `OLLAMA_MODEL` | A model already pulled by the Ollama service; defaults to `llama3.2` |
| `MEDIA_ROOT` | Persistent storage path for uploaded resumes |

`backend/.env.example` is for local development only. The application rejects a
missing production secret, empty production host list, or missing database
connection values. CORS is restricted to configured origins outside debug
mode. Django's production settings assume HTTPS termination at a trusted
reverse proxy that overwrites `X-Forwarded-Proto`.
Production HSTS is enabled for one year. Only enable
`SECURE_HSTS_INCLUDE_SUBDOMAINS` or `SECURE_HSTS_PRELOAD` after confirming all
affected subdomains meet their HTTPS requirements.

Before routing traffic to a new release:

```sh
python manage.py migrate --noinput
python manage.py collectstatic --noinput
python manage.py check --deploy
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

Run the commands from `backend/`. Configure the platform's release/start
commands separately where appropriate. Static files are served by WhiteNoise;
keep `staticfiles/` as build output, not durable data. Resume uploads are
stored on disk by default, so attach persistent storage or configure a private
object-storage backend before using an ephemeral/container filesystem.

Resume-to-job similarity currently uses TF-IDF and does not download a model.
AI analysis and interview generation call Ollama; deploy it as a reachable
service with the configured model already available. The Django API does not
start Ollama itself.

## Pre-release verification

From `frontend/`:

```sh
npm ci
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

From `backend/`:

```sh
python manage.py check
python manage.py check --deploy
python manage.py makemigrations --check --dry-run
python manage.py test
python -m pip check
```

The current backend test modules contain no test cases, so `manage.py test`
currently succeeds after running zero tests. Add automated coverage before
relying on this as a release gate.
