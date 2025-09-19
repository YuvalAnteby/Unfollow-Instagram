# Use official Node.js LTS image, prepare the dependencies
FROM node:18-slim AS prep
WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy the rest of the project files based on the prep image
FROM prep AS dev
WORKDIR /app
COPY --from=prep /app/node_modules /app/node_modules
CMD ["npm", "start"]

# TODO build and serve to prod
