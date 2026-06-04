# Build Phase
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN cd frontend && npm install && npm run build
RUN cd backend && npm install && npm run build

# Production Phase
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache tesseract-ocr
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/frontend/dist ./frontend/dist
RUN cd backend && npm install --only=production
EXPOSE 3000
CMD ["node", "backend/dist/server.js"]
