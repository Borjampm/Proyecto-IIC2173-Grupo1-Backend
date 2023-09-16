FROM node:16-alpine

WORKDIR /API

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN ["chmod", "+x", "./start.sh"]

ENTRYPOINT [ "./start.sh" ]

EXPOSE 3000
