#!ts-node
import fetch from "node-fetch";
import gql from "graphql-tag";

import { KibelaClient } from "../src/KibelaClient";
import { getEnv } from "../src/utils";
import { name, version } from "../package.json";

// to load KIBELA_* from example/.env (NodeJS only)
declare function require(path: string): any;
declare var __dirname;
require("dotenv").config({
  path: require("path").resolve(__dirname, ".env"),
})

const TEAM = getEnv("KIBELA_TEAM");
const TOKEN = getEnv("KIBELA_TOKEN");
const ENDPOINT = getEnv("KIBELA_ENDPOINT");
const USER_AGENT = `${name}/${version}`;

const client = new KibelaClient({
  endpoint: ENDPOINT,
  team: TEAM,
  accessToken: TOKEN,
  userAgent: USER_AGENT,
  fetch: (fetch as any) as typeof window.fetch,
  retryCount: 3
});

const HelloKibelaClient = gql`
  query HelloKibeaClient {
    currentUser {
      account
    }
  }
`;

async function main() {
  console.log(`Querying to ${client.endpoint} ...`);
  const response = await client.request({
    query: HelloKibelaClient
  });
  console.dir(response, { depth: 100 });
}

main();
