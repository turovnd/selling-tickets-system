FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3100

## THE LIFE SAVER
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

## Launch the wait tool and then your application
CMD /wait && npm run docker