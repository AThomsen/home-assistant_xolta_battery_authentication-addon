ARG BUILD_FROM
FROM $BUILD_FROM

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --update nodejs npm chromium

WORKDIR /app

COPY app/package*.json ./

RUN npm ci --omit=dev

# Copy data for add-on
COPY app /app

EXPOSE 8000

CMD [ "node", "server.js" ]
