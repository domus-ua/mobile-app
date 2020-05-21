# base image
FROM node as builder

ARG PLATFORM=web

EXPOSE 19000 19001 19002

# set working directory
WORKDIR /app/

# Copy all important files for the installation
COPY package*.json ./

RUN npm install -g
RUN npm install expo-cli

COPY . ./
RUN npm audit fix

CMD ["npm", "run", "start"]
