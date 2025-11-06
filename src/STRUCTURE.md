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
            ├── class UpsHidHandler{}
                ├── method connect() // [ node-hid event listener ]
                └── method disconnect() // [ remove emitters & close dev conn ]
    │   ├── ups-hid-handler.test.js
    │   ├── output-state-emitter.js
            ├── class OutputStateEmitter{}
                ├── method ack() // @todo
                ├── method update() // @todo
                ├── method done()
                └── method reset()
    │   └── output-state-emitter.test.js
    ├── helpers/
    │   ├── args.js // [ runtime arg eval for global use ]
            ├── function evalArgs()

    │   └── args.test.js
    │   ├── logger.js
            └── const logger = winston.createLogger()
    │   └── logger.test.js
    │   ├── etl.js // [ isolated ETL functions for data handling ]
            ├── function JSONstringifyRaw()
            ├── function JSONstringifyHex()
            ├── function sortObjectElements() // @todo
            ├── function splitBufferToChunks()
            └── function deriveChargeStatus()
    │   └── etl.test.js
    ├── models/
    │   ├── 
    │   └── ??
    ├── services/
    |   ├── args-file-service.js
            └── function writeArgsFile() // [ handles args config lifecycle ]
    |   ├── args-file-service.test.js
    │   ├── ups-hid-parser.js
            ├── class UpsHidParser{}
                └── method parse() // [ case statement hand-off by UsageID ]
    │   └── ups-hid-parser.test.js
    └── config/
    │   ├── config.js // [ static settings for 'keyOrder', 'usagesToParse' ]
    │   └── .runtime-args.json // [ tmp file w/ runtime args object ]
```

### Processing Workflow
```js
- ups-hid-handler.js
  ├── class UpsHidHandler{}
      ├── method connect()
      + process-hid-data.js ( raname process-buffer.js - replaced from parseHidData function directly in `ups-hid-parser.js`)
        ├── class ProcessHidData{}
            ├── init config to cache (keyOrder and usagesToParse)
            ├── init node-hid emitter for ups.on 'data'
            ├── init ProcessingEventEmitter() (pee - done and reset states)
            ├── method parse()
                ├── import helper functions (splitBufferIntoChunks, sortObjectElements)
    >
```

### Event Emitters

```js
// Event Registration and Emission:
on(eventName, listener) or addListener(eventName, listener): Registers a listener function to be executed whenever the eventName event is emitted.

once(eventName, listener): Registers a listener function that will be executed only once when the eventName event is emitted, and then automatically removed.

emit(eventName, [...args]): Triggers the eventName event, causing all registered listeners for that event to be called in the order they were registered. Any additional arguments passed to emit will be passed to the listener functions.

// Listener Management:
removeListener(eventName, listener) or off(eventName, listener): Removes a specific listener function for the given eventName.

removeAllListeners([eventName]): Removes all listeners for a specific eventName, or all listeners for all events if no eventName is provided.

listeners(eventName): Returns a copy of the array of listeners for the specified eventName. 

// State Management:
setMaxListeners(n): Sets the maximum number of listeners allowed for any single event. By default, this is 10, and a warning is emitted if more are added. Setting it to 0 or Infinity removes the limit.

getMaxListeners(): Returns the current maximum listener value.

// Special Events:
'error' event: This is a special event. If an EventEmitter emits an 'error' event and no listener is registered for it, the error is thrown, and the Node.js process will exit. It is crucial to always add a listener for 'error' events to prevent process crashes.

'newListener' event: Emitted whenever a new listener is added.

'removeListener' event: Emitted whenever a listener is removed.
```