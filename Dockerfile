# Stage 1: Build dependencies
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only dependency files first for caching
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Install dependencies efficiently (reduce memory & cache usage)
RUN pnpm install --frozen-lockfile --prefer-offline --ignore-scripts

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY . .

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Install pnpm globally in runtime
RUN npm install -g pnpm

# Copy only required files from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app ./

# Expose application port
EXPOSE 4002

# Start the application
CMD ["pnpm", "start"]
