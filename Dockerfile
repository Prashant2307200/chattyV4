FROM node:22-alpine AS builder

WORKDIR /builder

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . . 

RUN npm run build  


FROM alpine:3.19 AS runner

RUN apk add --no-cache libstdc++ libc6-compat

WORKDIR /runner

COPY --from=builder /builder/dist/app ./dist/app

RUN chmod +x ./dist/app

EXPOSE 8080

ENTRYPOINT ["./dist/app"]
