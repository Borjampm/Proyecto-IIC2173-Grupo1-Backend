FROM node:16-alpine

WORKDIR /API

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN ["chmod", "+x", "./start.sh"]

ENTRYPOINT [ "./start.sh" ]

ENV NEW_RELIC_NO_CONFIG_FILE=true

ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true \
NEW_RELIC_LOG=stdout
# etc.

EXPOSE 3000
