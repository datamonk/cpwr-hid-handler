## Directory Structure / Layout

### Definition Reference

<details>

<summary>Select to expand</summary>

- `src`: This is a common practice to house all application logic.

- `controllers`: Handles incoming requests, interacts with services, and sends responses.

- `models`: Defines data schemas and interacts with the database (often using an ORM).

- `routes`: Defines API endpoints and maps them to controllers.

- `services`: Contains business logic and interacts with models or external services.

- `middleware`: Houses reusable functions for request processing (e.g., authentication, validation).

- `config`: Contains application-specific configurations (e.g., database connections, server settings).

- `utils` or `helpers`: Contains utility functions or helper modules.

- `public`: For static assets like images, CSS, and client-side JavaScript.

- `tests`: Contains unit and integration tests.

- `migrations`: For database migration scripts (if using an ORM).

</details>

### Directory Tree

Below is a modified structure based on the general standards mentioned above.

- Jest tests are denoted in the filename and coupled with the associated code instead of a dedicated test directory.
  - Test artifacts for `__fixtures__` and `__mocks__` are managed from the project root directory so Jest will evaluate automatically by default.

```js
├── .env
├── .gitignore
├── package.json
├── read-ups.js > src/app.js // [ sym link ]
├── __fixtures__
    └── buffer-data.js
├── __mocks__
    └── node-hid.js
└── src/
    ├── app.js // [ kickoff args eval & controller logic ]
    ├── controllers/
    │   ├── ups-hid-handler.js
            ├── class UpsHidHandler {}
                ├── method connect() // [ node-hid event listener ]
                └── method disconnect() // [ remove emitters & close dev conn ]
    │   └── ups-hid-handler.test.js
    ├── helpers/
    │   ├── args.js // [ runtime arg eval for global use ]
            ├── function evalArgs()
            ├── function purgeRuntimeArgs() // @todo
            └── function saveRuntimeArgs() // @todo
    │   └── args.test.js
    │   ├── logger.js
            └── const logger = winston.createLogger()
    │   └── logger.test.js
    │   ├── etl.js // [ isolated ETL functions for data handling ]
            ├── function JSONstringifyRaw()
            ├── function JSONstringifyHex()
            ├── function sortReportData() // @todo
            ├── function splitBufferToChunks()
            └── function deriveChargeStatus()
    │   └── etl.test.js
    ├── models/
    │   ├── 
    │   └── ??
    ├── services/
    │   ├── ups-hid-parser.js
            ├── class UpsHidParser{}
                └── method parse() // [ case statement hand-off by UsageID ]
    │   └── ups-hid-parser.test.js
    └── config/
    │   ├── config.js // [ static settings for 'keyOrder', 'usagesToParse' ]
    │   └── .runtime-args.json // [ tmp file w/ runtime args object ]
```