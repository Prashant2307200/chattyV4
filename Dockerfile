### Stage 1: Client Build

FROM node:22-alpine AS client

WORKDIR /client

COPY ./client/package*.json ./

RUN npm ci --legacy-peer-deps

COPY ./client .

RUN chown -R node:node /client && chmod -R 755 /client

RUN npm run build


### Stage 2: Server Build (Static Binary)

FROM node:22-alpine AS server

WORKDIR /server

RUN apk add --no-cache build-base python3 make g++ musl-dev git

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build


### Stage 3: Final Image (Scratch)

FROM scratch AS app

WORKDIR /app

COPY --from=client /client/dist ./client/dist

COPY --from=server /server/dist/app ./dist/app

ENTRYPOINT ["./dist/app"]