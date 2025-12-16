# Use Node.js environment
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the Vite port
EXPOSE 5173

# Start the app with --host so Docker can access it
CMD ["npm", "run", "dev", "--", "--host"]