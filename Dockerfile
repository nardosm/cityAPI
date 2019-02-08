FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Include this step in Dockerfile if its not in Wercker file
#RUN rm -rf node_modules/ && npm update

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]