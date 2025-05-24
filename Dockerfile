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


FROM alpine:3.19

RUN apk add --no-cache libstdc++ libc6-compat

WORKDIR /app

COPY --from=server /server/client/dist ./client/dist
COPY --from=server /server/dist/app ./dist/app

RUN chmod +x ./dist/app

EXPOSE 8080

ENTRYPOINT ["./dist/app"]
