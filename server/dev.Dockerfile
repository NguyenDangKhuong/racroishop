FROM node:slim

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

# RUN yarn add pm2 -g

COPY . .

RUN yarn build

# ENV PM2_PUBLIC_KEY kmb3vq3uoq02mpx
# ENV PM2_SECRET_KEY puzbowll3e9a2xy
ENV NODE_ENV=production

USER node

EXPOSE 4000

CMD [ "yarn", "server" ]
# CMD ["yarn", "pm2-runtime"]
