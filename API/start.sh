#!/bin/sh
echo "Starting [API]"

if ! yarn sequelize-cli db:migrate:status | grep -q "not migrated"; then
    yarn dropdb database
    yarn createdb database
    # yarn sequelize-cli db:migrate:undo:all > /dev/stdout
    yarn sequelize-cli db:migrate > /dev/stdout
    echo "[API] Migrations ran"
else
    # yarn sequelize-cli db:migrate:undo:all > /dev/stdout
    yarn sequelize-cli db:migrate > /dev/stdout
    echo "[API] Migrations already ran"
fi

yarn api