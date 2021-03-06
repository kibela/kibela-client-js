#!ts-node
import fetch from "node-fetch";
import gql from "graphql-tag";

import { KibelaClient, getEnv, ensureStringIsPresent } from "../src";
import { name, version } from "../package.json";

// to load KIBELA_* from example/.env (NodeJS only)
// `import "dotenv/config" does not work because it tries to load .env in the current directry
declare function require(path: string): any;
declare var __dirname;
require("dotenv").config({
  path: require("path").resolve(__dirname, ".env")
});

// required
const TEAM = ensureStringIsPresent(getEnv("KIBELA_TEAM"), "KIBELA_TEAM");
// required
const TOKEN = ensureStringIsPresent(getEnv("KIBELA_TOKEN"), "KIBELA_TOKEN");
// optional
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
