FROM node:20 as build

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

FROM node:20 

WORKDIR /home/app

COPY --from=build /home/app /home/app

EXPOSE 3000

CMD ["npm", "run", "start"]