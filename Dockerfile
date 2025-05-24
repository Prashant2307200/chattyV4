FROM node:22-alpine AS client

WORKDIR /client

COPY client/package*.json ./

RUN npm ci --legacy-peer-deps 

COPY client/ .

RUN chown -R node:node /client && chmod -R 755 /client

RUN npm run build


FROM node:22-alpine AS server

WORKDIR /server

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . . 

COPY --from=client /client/dist ./client/dist

RUN npm run build 

# RUN chmod +x dist/app


FROM gcr.io/distroless/cc AS app

WORKDIR /app

COPY --from=server /server/dist/app .

EXPOSE 8080 

ENTRYPOINT ["./app"]
