FROM node:22-alpine AS builder

WORKDIR /builder

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN chown -R node:node /builder && chmod -R 755 /builder

RUN npm run build

FROM nginx:alpine AS runner

COPY --from=builder /builder/dist /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf 

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]