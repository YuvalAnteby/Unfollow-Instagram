# Use official Node.js LTS image, prepare the dependencies
FROM node:18-slim AS prep
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Copy the rest of the project files based on the prep image
FROM prep AS dev
WORKDIR /app
COPY --from=prep /app/node_modules /app/node_modules
CMD ["npm", "start"]

# Build the project
FROM prep AS build
WORKDIR /app
COPY . .
RUN npm run build

# Create prod from nginx image
FROM nginx:1.27-alpine AS prod
RUN apk add --no-cache curl
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
# Copy a hardened nginx config that serves SPA (fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Static assets
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
# Simple healthcheck
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]