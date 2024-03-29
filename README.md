## Documentation

- [Documentation](#documentation)
  - [Run the project locally](#run-the-project-locally)
  - [Run with Docker](#run-with-docker)
  - [How it works?](#how-it-works)
  - [Managed events](#managed-events)
  - [Testing transactions](#testing-transactions)
  - [Collections retantion](#collections-retantion)
  - [Entities](#entities)
    - [Enrollments](#enrollments)
      - [`course.enrollment.created`](#courseenrollmentcreated)
      - [`course.enrollment.update` \& `course.enrollment.completed`](#courseenrollmentupdate--courseenrollmentcompleted)
      - [`course.enrollment.deleted`](#courseenrollmentdeleted)
- [Roadmap](#roadmap)
  - [Already available](#already-available)
  - [Next in pipeline](#next-in-pipeline)
  - [Pay attention](#pay-attention)
  - [Feature request](#feature-request)
  - [Contributing](#contributing)

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

### Run with Docker

To run the project using docker, follow the following steps

1. Clone the project
2. Build the image. You can choose to pass all needed env variables during image build or even during the run phase.

```
$ docker build -t \
  docebo-webhook-listener \
  --build-arg MONGODB_URI=<your-mongo-connenction-string> \
  --build-arg DB_NAME=<your-mongo-db-name> \
  --build-arg COMPUTE_ERROR_RETANTION=<your-retention-rule> \
  --build-arg TRANSACTION_ERROR_RETANTION=<your-retention-rule> \
  --build-arg TRANSACTION_RETANTION=<your-retention-rule> \
  --no-cache .
```

or

```
$ docker build -t \
  docebo-webhook-listener \
  --no-cache .
```

3. Run the image. Here you have to pass all the env variables if you didn't pass the during the build phase.

```
$ docker run -p80:3000 docebo-webhook-listener
```

or

```
$ docker run \
  --env MONGODB_URI=<your-mongo-connenction-string> \
  --env DB_NAME=<your-mongo-db-name> \
  --env COMPUTE_ERROR_RETANTION=<your-retention-rule> \
  --env TRANSACTION_ERROR_RETANTION=<your-retention-rule> \
  --env TRANSACTION_RETANTION=<your-retention-rule> \
  -p80:3000 docebo-webhook-listener
```

### How it works?

<img width="1121" alt="Screenshot 2024-03-18 alle 14 52 10" src="https://github.com/graz-dev/docebo-webhook-listener/assets/62215881/d8bf9583-71fc-4680-897d-3df2f7804b21">

_Docebo Webhook Listener_ is a simple project designed to retrieve your Docebo webhook transactions and manage them. At its core, it utilizes NestJS to create a server for receiving transactions and storing them in a _MongoDB_ collection.

> Due to Docebo's error handling, which considers a request as failed if a 200 response is not received within 5 seconds, the project utilizes promises to persist each webhook message and after sending the response to Docebo, it then performs any computational tasks to keep the response latency to a minimum.

The project expose only the `POST /transaction` route to communicate with Docebo, so you just need to configure each webhook to send messages to this route.
The `POST /transaction` route just get the webhook message and save it on the `transactions` MongoDB collection.
To keep the response latency at a minimun the route return a `200` after saving the transaction as it is, then the computational activities are performed asyncronously, in case something went wrong with the transaction saving Docebo will receive a `500` status code as response.
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

### Collections retantion

After saving the transaction on the `transactions` MongoDB collection the application compute it.
If the compute method throws errors, they are logged in the `compute_errors` MongoDB collection.

The `transactions`, `transaction_errors` and `compute_errors` collection are under retantion.
You can configure the TTL of each document from the `.env` file as follow:

```
COMPUTE_ERROR_RETANTION=<(1|n)-(D-M-Y)>
TRANSACTION_ERROR_RETANTION=<(1|n)-(D-M-Y)>
TRANSACTION_RETANTION=<(1|n)-(D-M-Y)>
```

Where:

- `D` means _days_
- `M` means _months_
- `Y` means _years_

For example the following configuration define that each document in these collections has a TTL of 1 day:

```
COMPUTE_ERROR_RETANTION=1-D
TRANSACTION_ERROR_RETANTION=1-D
TRANSACTION_RETANTION=1-D
```

Pay attention that the first char before the `-` must be an integer.
Right now the retention cronJob is configured to run each day at `9 AM`.
You can edit this config in `src/cron/retantion.cron.ts` by changing the cron expression in the decorator for each public method of the class.

### Entities

#### Enrollments

Each enrollment is saved in the `enrollments` MongoDB collection.
You can find the Enrollments schema definition in `src/schema/enrollment.schema.ts`.
The constraint on the `enrollments` collection is that the combination of `user_id` and `course_id` is unique, so two or more enrollments for the same user in the same course are not allowed.

##### `course.enrollment.created`

Each time the server receive a transaction for the event `course.enrollment.created` a new enrollment document is created in the `enrollments` MongoDB collection.
If a trasaction for a combination of `user_id` and `course_id` that already exist is received the application throw an error because it check the existence of other enrollments which violate this constraint before saving it.

##### `course.enrollment.update` & `course.enrollment.completed`

Each time the server receive a transaction for the event `course.enrollment.upate` the application check its existence by query the database to get an enrollment with the same `user_id` and `course_id` of the payload recived.
If the query doesn't get anything then the application throws an error if the enrollment exist the is updated.

The difference between `course.enrollment.update` and `course.enrollment.completed` is that on course completion it adds the `completion_date` field on the enrollment document.

##### `course.enrollment.deleted`

Each time a user is unenrolled from a course a transaction over this event is executed.
Each time the server receive a transaction for the event `course.enrollment.deleted` the application check its existence by query the database to get an enrollment with the same `user_id` and `course_id` of the payload recived.
If the query doesn't get anything then the application throws an error if the enrollment exist the is physically delete.

## Roadmap

### Already available

- [x] Get all incoming Docebo webhooks call and save them in a MongoDB collection
- [x] Handle errors persisting transaction saving transaction errors on a dedicated MongoDB collection to keep track of all errors and eventually retry
- [x] Manage `compute_errors` collection to save errors from transaction compute
- [x] Manage `transactions`, `transaction_errors` and `compute_errors` collections retantion based on configurations
- [ ] Manage `Enrollments` events
  - [x] Keep track of each enrollment in a dedicated MongoDB collection for each combination of user and course
  - [x] Handle enrollments update
  - [x] Handle enrollments deletion
  - [x] Handle couses completion

### Next in pipeline

- [ ] Manage `Enrollments` events
  - [ ] Handle collection initial load
  - [ ] Handle enrollment in ILT courses
  - [ ] Expose APIs to get enrollment information

### Pay attention

Right now the project doesn't support the following Docebo webhooks configuration:

1. Payload grouping for events of the same type
2. Additional data and `extra_data` property

### Feature request

For any information about the project, to ask for support or for new feature contact me at:

1. [LinkedIn](www.linkedin.com/in/castograziano)
2. [Email](mailto:cst.grzn@gmail.com)
3. [Open an issue](https://github.com/graz-dev/docebo-webhook-listener/issues/new)

It's a pleasure to keep in touch with you!

### Contributing

Any contribution is welcome!
