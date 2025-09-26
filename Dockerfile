# Stage 1: Build dependencies
FROM node:20-alpine AS build
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY . .

# No build step needed for JavaScript (remove pnpm build)
# If you add TypeScript later, uncomment the below line
# RUN pnpm build


# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary files for runtime
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma
COPY --from=build /app ./

# Expose port
EXPOSE 4002

# Start app
CMD ["pnpm", "start"]
