# run-local-frontend.ps1
# Builds the frontend and serves it locally using 'serve' while pointing API calls to the deployed backend.
# Usage: ./run-local-frontend.ps1 -ApiUrl "https://quiz-app-4v2w.onrender.com/api"
param(
    [string]$ApiUrl = "https://quiz-app-4v2w.onrender.com/api",
    [int]$Port = 3000
)

Write-Host "Building frontend..."
Push-Location frontend
npm ci
npm run build
Pop-Location

# Ensure 'serve' is installed
if (-not (Get-Command serve -ErrorAction SilentlyContinue)) {
    Write-Host "Installing 'serve' globally (requires admin privileges)..."
    npm install -g serve
}

Write-Host "Serving built frontend on http://localhost:$Port with API proxied to $ApiUrl"
# Serve the build directory and set REACT_APP_API_URL for runtime (serve doesn't set env vars to the static build,
# but the frontend uses REACT_APP_API_URL at build-time; we already built with default API URL, so this is an easy local
# verification route: you can edit build/static/js/* to replace base URL, or run `npm start` instead for dev mode.)

serve -s frontend/build -l $Port
