# Use an official Node.js runtime with version 22.x
FROM node:22

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Define the command to run the bot
CMD ["npm", "start"]

# Make sure node 22.x is used (if environment defaults to 16.x)
RUN node -v
