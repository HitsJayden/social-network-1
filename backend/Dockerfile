FROM node:14

WORKDIR /build
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 5000

CMD ["npm", "start"]