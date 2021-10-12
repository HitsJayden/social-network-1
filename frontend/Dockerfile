FROM node:14

WORKDIR /build 

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]