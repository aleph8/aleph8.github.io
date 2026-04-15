FROM node:20-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

EXPOSE 4321

# Default command for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
