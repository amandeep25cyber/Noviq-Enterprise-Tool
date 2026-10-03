# Use lightweight Node.js 20 base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package management files
COPY package*.json ./

# Install dependencies (production)
RUN npm install

# Copy server application source code
COPY . .

# Expose backend port
EXPOSE 8080

# Set environment defaults
ENV PORT=8080
ENV NODE_ENV=production

# Command to start backend server
CMD ["npm", "run", "dev"]

