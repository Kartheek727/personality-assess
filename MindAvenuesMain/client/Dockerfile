# Use the official Node.js image as a base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
