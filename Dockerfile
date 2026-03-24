# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

ARG NUXT_PUBLIC_ENV
ARG NUXT_PUBLIC_API_BASE
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID

ENV NUXT_PUBLIC_ENV=$NUXT_PUBLIC_ENV
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run with Node (Nitro server)
FROM node:20-alpine AS final
WORKDIR /app
COPY --from=build /app/.output ./output

EXPOSE 3000
CMD ["node", "output/server/index.mjs"]