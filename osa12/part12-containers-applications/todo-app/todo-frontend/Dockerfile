FROM node:20 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN VITE_BACKEND_URL=http://localhost:3000 npm run build

FROM nginx:1.25-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html