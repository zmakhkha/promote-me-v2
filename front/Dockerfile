FROM node:18	

# Optional, but a good practice
RUN apt-get update && apt-get install -y nano

WORKDIR /app

# Install only once at build time
COPY package.json package-lock.json ./

RUN npm install

# Install vite globally if you really need to (optional)
RUN npm install -g vite

ENV PATH /app/node_modules/.bin:$PATH

# Expose the Vite dev server port (default is 3000)
EXPOSE 3000

CMD ["npm", "run", "dev"]
