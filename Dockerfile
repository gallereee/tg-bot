FROM node:16

# Link image to repository
LABEL org.opencontainers.image.source="https://github.com/gallereee/iam"

# Set github token required to fetch packages
ARG github_token
ENV GITHUB_TOKEN $github_token

# Create app directory
WORKDIR /app
# Install app dependencies
COPY ["package.json", "package-lock.json", ".npmrc", "./"]
RUN npm ci
# Remove token-related stuff
RUN rm -f .npmrc
ENV GITHUB_TOKEN=""
# Bundle app source
COPY . .
# Build project
RUN npm run build

CMD ["sh", "./scripts/start.sh"]
