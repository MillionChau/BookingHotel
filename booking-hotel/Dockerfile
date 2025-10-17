FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Nhận biến môi trường API URL từ docker-compose
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build production (React sẽ inject biến này)
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

# Copy built app vào nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copy file cấu hình nginx
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
