FROM node:16

COPY . .

WORKDIR /WEBAPP

ENV PATH="./node_modules/.bin_$PATH"

EXPOSE 3000

RUN npm install
RUN npm run build

CMD ["npm", "start"]
