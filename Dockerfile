FROM node:22-alpine AS client

WORKDIR /client

COPY ./client/package*.json ./

RUN npm ci --legacy-peer-deps

COPY ./client .

RUN chown -R node:node /client && chmod -R 755 /client

RUN npm run build

FROM node:22-alpine AS server

WORKDIR /server

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . . 

RUN npm run build  

FROM alpine AS app

COPY --from=client /client/dist /client/dist

COPY --from=server /server/dist/app /dist/app

RUN chmod +x /dist/app

ENTRYPOINT ["/dist/app"]
