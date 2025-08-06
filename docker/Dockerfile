FROM alpine:3.22
LABEL org.opencontainers.image.source=https://github.com/jcamiel/hurl-express-tutorial
LABEL org.opencontainers.image.description="Movies Box, an Hurl Tutorial"
LABEL org.opencontainers.image.licenses=Apache-2.0

RUN addgroup -S app && adduser -S app -G app
RUN apk add --update nodejs npm
USER app
WORKDIR /app
COPY --chown=app:app ./ /app/
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node","dist/bin/www.js"]
