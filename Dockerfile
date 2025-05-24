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

COPY --from=client /client/dist/ ./client/dist

# RUN chown -R node:node /server && chmod -R 755 /server

RUN npm run build 


FROM gcr.io/distroless/base AS app

WORKDIR /app

COPY --from=client /client/dist/ ./client/dist
COPY --from=server /server/dist/ ./dist  

EXPOSE 8080

RUN chown -R node:node /app && chmod -R 755 /app

ENTRYPOINT ["./dist/app"]
