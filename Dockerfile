FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_USER_API
ARG VITE_ANIMAL_API
ARG VITE_TOOL_API
ARG VITE_GOOGLE_CLIENT_ID

ENV VITE_USER_API=$VITE_USER_API
ENV VITE_ANIMAL_API=$VITE_ANIMAL_API
ENV VITE_TOOL_API=$VITE_TOOL_API
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV NODE_ENV=production

RUN npm run build

FROM nginx:alpine

# Remove default nginx config (cleaner)
RUN rm -rf /etc/nginx/conf.d/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]