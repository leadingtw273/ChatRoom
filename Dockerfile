# build stage
FROM node:8.12.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM keymetrics/pm2:8-alpine as production-stage
COPY --from=build-stage /app/dist ./dist
COPY package.json .
COPY pm2.config.js .
COPY app.js .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
RUN npm install --production

# Expose the listening port of your app
EXPOSE 8084 
CMD [ "pm2-runtime", "start", "pm2.config.js" ]