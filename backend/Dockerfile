FROM node:12
USER root
WORKDIR /var/app
COPY package*.json /var/app/
RUN npm i
COPY . /var/app/
EXPOSE 3000
RUN npm run build
CMD npm run start:prod
