FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine

# Remove default nginx config (cleaner)
RUN rm -rf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]