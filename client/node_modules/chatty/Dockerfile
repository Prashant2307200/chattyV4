FROM node:22-alpine AS client

WORKDIR /client

COPY client/package*.json ./

RUN npm ci --legacy-peer-deps

COPY client .

RUN npm run build


FROM node:22-alpine AS server

WORKDIR /server

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

COPY --from=client /client/dist ./client/dist

RUN npm run build

RUN chmod +x ./app


FROM debian:bullseye-slim

WORKDIR /app

# Install security updates and remove cache to reduce vulnerabilities
RUN apt-get update && apt-get upgrade -y && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=server /server/app .

EXPOSE 8080

ENTRYPOINT ["./app"]
