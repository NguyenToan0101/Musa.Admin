# Stage 1: Build app
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Stage 2: Runner với Nginx + Node.js
FROM node:20-alpine AS runner

# Cài nginx
RUN apk add --no-cache nginx

WORKDIR /app
COPY --from=builder /app ./
COPY nginx.conf /etc/nginx/nginx.conf

ENV NODE_ENV production

# Copy default nginx static dir để tránh lỗi
RUN mkdir -p /run/nginx

# Expose port for Nginx
EXPOSE 80

# Start cả Nginx và Next.js app
CMD sh -c "npm run start & nginx -g 'daemon off;'"
