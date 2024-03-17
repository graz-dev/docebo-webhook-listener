FROM node:18-alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine As production

ARG MONGODB_URI
ARG DB_NAME
ARG COMPUTE_ERROR_RETANTION
ARG TRANSACTION_ERROR_RETANTION
ARG TRANSACTION_RETANTION

ENV MONGODB_URI=$MONGODB_URI
ENV DB_NAME=$DB_NAME
ENV COMPUTE_ERROR_RETANTION=$COMPUTE_ERROR_RETANTION
ENV TRANSACTION_ERROR_RETANTION=$TRANSACTION_ERROR_RETANTION
ENV TRANSACTION_RETANTION=$TRANSACTION_RETANTION

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
COPY --from=development /usr/src/app/dist ./dist
CMD [ "node", "dist/main.js" ]
