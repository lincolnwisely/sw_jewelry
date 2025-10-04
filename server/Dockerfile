FROM node:20-alpine

# Install pnpm globally (match your local version)
RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies (no frozen-lockfile to avoid monorepo conflicts)
RUN pnpm install --prod --no-lockfile

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["pnpm", "start"] 