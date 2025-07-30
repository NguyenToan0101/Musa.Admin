# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Nginx stage
FROM nginx:stable-alpine AS runner

# Copy Nginx config (bạn cần tự tạo file nginx.conf ở cùng thư mục với Dockerfile)
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from builder
# Giả sử build ra thư mục 'build' (React) hoặc 'out' (Next.js), bạn sửa lại đúng tên thư mục
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
