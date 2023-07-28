FROM alpine:3.18

RUN addgroup -S app && adduser -S app -G app
RUN apk add --update nodejs npm
USER app
WORKDIR /app
COPY --chown=app:app ./ /app/
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["node","dist/bin/www.js"]