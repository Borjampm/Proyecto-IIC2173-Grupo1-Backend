#!/bin/sh
echo "Starting [API]"

if ! yarn sequelize-cli db:migrate:status | grep -q "not migrated"; then
    yarn sequelize-cli db:migrate > /dev/stdout
    echo "[API] Migrations ran"
else
    echo "[API] Migrations already ran"
fi

yarn api