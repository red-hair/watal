FROM node:12.13.1
WORKDIR /app
COPY package*.json ./
RUN npm install
ENV HOST 0.0.0.0
EXPOSE 3000