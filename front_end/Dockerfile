#Stage 1: Building react app
FROM node:alpine AS build

WORKDIR /app

COPY . /app

RUN npm install && npm run build


#Stage 2: Serving the build with nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

