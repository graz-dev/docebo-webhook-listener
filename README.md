- [Documentation](#documentation)
  - [Run the project locally](#run-the-project-locally)
  - [How it works?](#how-it-works)
  - [Managed events](#managed-events)
  - [Testing transactions](#testing-transactions)
  - [Entities](#entities)
    - [Enrollments](#enrollments)
- [Roadmap](#roadmap)
  - [Already Available](#already-available)
  - [Next in pipeline](#next-in-pipeline)
  - [Pay Attention](#pay-attention)

## Documentation

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

### How it works?

_Docebo Webhook Listener_ is a simple project designed to retrieve your Docebo webhook transactions and manage them. At its core, it utilizes NestJS to create a server for receiving transactions and storing them in a _MongoDB_ collection.

> Due to Docebo's error handling, which considers a request as failed if a 200 response is not received within 5 seconds, the project utilizes promises to persist each webhook message and after sending the response to Docebo, it then performs any computational tasks to keep the response latency to a minimum.

The project expose only the `POST /transaction` route to communicate with Docebo, so you just need to configure each webhook to send messages to this route.
The `POST /transaction` route just get the webhook message and save it on the `transactions` MongoDB collection.
To keep the response latency at a minimun the route return a `201` after saving the transaction as it is, then the computational activities are performed asyncronously, in case something went wrong with the transaction saving Docebo will receive a `500` status code as response.
In case of error saving the transaction the error is saved in a dedicated `transaction_errors` MongoDB collection.

To know more about docebo weebhook management read the following [docebo's documentation page](https://help.docebo.com/hc/it/articles/360020124459-Creare-e-gestire-i-webhook).
To know more about docebo webhook events management read the following [docebo's documentation page](https://help.docebo.com/hc/it/articles/360020124479-Eventi-Webhook).

### Managed events

1. **Enrollments**
   1. `course.enrollment.created`
   2. `course.enrollment.deleted`
   3. `course.enrollment.update`
   4. `course.enrollment.completed`

### Testing transactions

The project is designed to be tested with [Bruno](https://www.usebruno.com/) but you can use the API client you prefer.
In the `bruno-collection` folder you can find an example transaction for each event currently managed.
You just need to import the collection and try send transaction.

### Entities

#### Enrollments

---

## Roadmap

### Already Available

- [x] Get all incoming Docebo webhooks call and save them in a MongoDB collection
- [x] Handle errors persisting transaction saving transaction errors on a dedicated MongoDB collection to keep track of all errors and eventually retry
- [ ] Manage `Enrollments` events
  - [x] Keep track of each enrollment in a dedicated MongoDB collection for each combination of user and course
  - [x] Handle enrollments update
  - [x] Handle enrollments deletion
  - [x] Handle couses completion

### Next in pipeline

- [ ] Manage `transactions` & `transaction_errors` collection retantion based on configurations
- [ ] Manage `compute_errors` collection to save errors from transaction compute
- [ ] Manage `Enrollments` events
  - [ ] Handle collection initial load
  - [ ] Handle enrollment in ILT courses
  - [ ] Expose APIs to get enrollment information

### Pay Attention

Right now the project doesn't support the following Docebo webhooks configuration:

1. Payload grouping for events of the same type
2. Additional data and `extra_data` property
