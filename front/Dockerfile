# front/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Install deps from lockfile
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest (this includes src/app/*)
COPY . .

# Good defaults for dev inside Docker
ENV HOST=0.0.0.0 \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1 \
    CHOKIDAR_USEPOLLING=1 \
    WATCHPACK_POLLING=true

EXPOSE 3000
CMD ["npm", "run", "dev"]
