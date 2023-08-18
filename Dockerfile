FROM node:lts-bookworm-slim

LABEL maintainer="ljt@meidosem.com"

RUN apt-get update -yqq && \
    apt-get install -yqq --no-install-recommends \
    vim \
    curl \
    btop

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
EXPOSE 3000

CMD [ "node", "server.js" ]
