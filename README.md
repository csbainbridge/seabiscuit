# Seabiscuit (PA Realtime Race Day Viewer)

A realtime web application for viewing live racing data.

Racing Data Customer Support Driven Project (With management from Isaac Hughes).

## Install

1. Install Node and MongoDB.
2. `git clone https://github.com/csbainbridge/seabiscuit.git`
3. `cd` into project directory.
4. `npm install`


## Starting the API Server
1. Start MongoDB server on `localhost`
2. `npm run start:api`
3. Open web browser and got to `localhost:8080`

**NOTE:** Always start the API server before the Ingestion Processor.

## Starting the Ingestion Processor

To ensure to the ingestion process works correctly you will first need to create a directory within the `seabiscuit` ingestion for a territory. Following this create two folders `betting` and `racecard`. Then open up `Processor.js` and add the directory paths to the WatchDirs array (For example, `["./ingestion/zaf/betting", './ingestion/zaf/racecard']`)

1. `cd` into project directory
2. `npm run start:ingest`


