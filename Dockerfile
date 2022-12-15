FROM node:lts-alpine as build

WORKDIR /app

COPY package.json /app

# COPY yarn.lock /app

# RUN yarn cache clean 

RUN ["yarn", "install"]

COPY . /app

RUN ["yarn", "run", "build"]

FROM nginx:stable-alpine
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
