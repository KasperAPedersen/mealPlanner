# Mini guide for running the image as a standalone -ARK
#
# 1. Builds the image
# 2. Deploys the image in a docker container
# 3. Access the containers shell
#
# docker build -t <image-name> .
# docker run -dit --name <container-name> <image-name>
# docker exec -u 0 -it <container-name> <shell>

# Development Stage
FROM node:current-bookworm AS development

# Set working directory
WORKDIR /usr/local/webapp

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application for development
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Node.js app in development mode
CMD ["npm", "run", "dev"]  

# Production Stage (minimal)
FROM node:current-bookworm AS production

# Set working directory
WORKDIR /usr/local/webapp

# Copy only package.json and package-lock.json for clean install
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the Node.js app in production mode
CMD ["npm", "start"]
