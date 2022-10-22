FROM node:alpine as builder

WORKDIR /app

RUN apk update && apk add --no-cache git

COPY package-lock.json .

COPY package.json .

RUN npm install

COPY . .

CMD [ "node","index.js"]
