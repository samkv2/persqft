#!/usr/bin/env bash
# ==========================================================
# PERSQFT CONSTRUCTIONS — LOCAL OFFLINE RUNNER (PHP + MYSQL)
# ==========================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DATA_DIR="/tmp/persqft_mariadb"
SOCKET_FILE="/tmp/persqft_mariadb.sock"
PID_FILE="/tmp/persqft_mariadb.pid"
PORT=3307
PHP_PORT=8080

echo "🚀 [PERSQFT] Initializing local offline PHP & MariaDB stack..."

# 1. Initialize MariaDB datadir if not present
if [ ! -d "${DATA_DIR}" ]; then
  echo "📦 Initializing local MariaDB data directory at ${DATA_DIR}..."
  mariadb-install-db --datadir="${DATA_DIR}" --auth-root-authentication-method=normal >/dev/null 2>&1
fi

# 2. Check if MariaDB is already running
if ! mariadb-admin --socket="${SOCKET_FILE}" ping >/dev/null 2>&1; then
  echo "🐘 Starting local MariaDB instance on 127.0.0.1:${PORT}..."
  mariadbd \
    --datadir="${DATA_DIR}" \
    --port="${PORT}" \
    --socket="${SOCKET_FILE}" \
    --pid-file="${PID_FILE}" \
    --bind-address=127.0.0.1 \
    --skip-networking=0 \
    --innodb-flush-method=fsync \
    >/dev/null 2>&1 &
  
  # Wait for MariaDB to start
  for i in {1..30}; do
    if mariadb-admin --socket="${SOCKET_FILE}" ping >/dev/null 2>&1; then
      break
    fi
    sleep 0.2
  done
fi

echo "✓ MariaDB is active on port ${PORT}."

# 3. Create database and seed from database.sql
echo "🗄️ Setting up 'persqft_db' database and seeding initial records..."
mariadb -h 127.0.0.1 -P "${PORT}" -u root -e "CREATE DATABASE IF NOT EXISTS persqft_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mariadb -h 127.0.0.1 -P "${PORT}" -u root persqft_db < "${ROOT_DIR}/php_site/database.sql"
echo "✓ Database schema and seed data loaded successfully."

# 4. Export DB environment variables
export DB_HOST="127.0.0.1"
export DB_PORT="${PORT}"
export DB_NAME="persqft_db"
export DB_USER="root"
export DB_PASS=""

echo ""
echo "=========================================================="
echo "✨ PERSQFT CONVENTIONAL PHP & MYSQL SYSTEM IS LIVE!"
echo "🌐 Public Website:  http://127.0.0.1:${PHP_PORT}/"
echo "🔐 CMS Admin Panel: http://127.0.0.1:${PHP_PORT}/admin/login.php"
echo "   Default Admin:   admin@persqft.com"
echo "   Default Pass:    PersqftAdmin2026!"
echo "=========================================================="
echo ""
echo "Starting PHP local development server..."
exec php -S 127.0.0.1:${PHP_PORT} -t "${ROOT_DIR}/php_site"
