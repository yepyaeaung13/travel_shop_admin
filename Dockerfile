FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Limit memory usage during build
ENV NODE_OPTIONS="--max-old-space-size=768"

RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FILEBASE_GATEWAY_PATH

# Build application
RUN pnpm build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["pnpm", "start"]