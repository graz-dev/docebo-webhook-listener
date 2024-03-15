# docebo-webhook-listener

_Docebo Webhook Listener_ is a simple project designed to retrieve your Docebo webhook transactions and manage them. At its core, it utilizes NestJS to create a server for receiving transactions and storing them in a _MongoDB_ collection.

> Due to Docebo's error handling, which considers a request as failed if a 200 response is not received within 5 seconds, the project utilizes promises to persist each webhook message. After sending the response to Docebo, it then performs any computational tasks to keep the response latency to a minimum.

[Check the feature list & roadmap](#roadmap)

## Documentation 

### Index

1. [Run the project locally](#run-the-project-locally)

### Run the project locally

To run the project locally follow the following steps:

1. Install the project dependencies:

```
$ yarn
or
$ npm i
```

2. Create an `.env` file in the root directory with the following variables for MongoDB connection:

```
MONGODB_URI=<your-mongo-uri>
DB_NAME=<your-db-name>
```

3. Run the project:

```
$ yarn run start
or
$ npm run start
```
## Roadmap

### Already Available

- [X] Get all incoming Docebo webhooks call and save them in a MongoDB collection
- [X] Handle errors persisting transaction saving transaction errors on a dedicated MongoDB collection to keep track of all errors and eventually retry
- [ ] Manage `Enrollments` events
  - [X] Keep track of each enrollment in a dedicated MongoDB collection for each combination of user and course

### Next in pipeline 

- [ ] Manage `transactions` & `transaction_errors` collection retantion based on configurations
- [ ] Manage `compute_errors` collection to save errors from transaction compute
- [ ] Manage `Enrollments` events
  - [ ] Handel collection initial load 
  - [ ] Keep track of each enrollment in a dedicated MongoDB collection for each combination of user and course
  - [ ] Handle enrollments update
  - [ ] Handle enrollments deletion
  - [ ] Handle enrollment in ILT courses 
  - [ ] Handle couses completion

### Pay Attention

Right now the project doesn't support the following Docebo webhooks configuration:

1. Payload grouping for events of the same type
2. Additional data and `extra_data` property
