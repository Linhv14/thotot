FROM node:21

WORKDIR /var/www

RUN npm install

RUN chown -Rh node:node /var/www

USER node

EXPOSE 3000

CMD ["npm", "run", "start:prod" ]