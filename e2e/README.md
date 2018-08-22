# `e2e`

> End-to-end tests for the `@carbon/toolkit` CLI

## Getting Started

Before being able to run our end-to-end tests, you'll need to download and
install [Docker](https://store.docker.com/editions/community/docker-ce-desktop-mac). We use docker for a couple of reasons, namely:

- There is an npm-like technology called verdaccio that has a docker image that
  we can run to simulate an npm registry
- We can run all of our tests in an isolated context and make sure that they
  don't mess up the contributor's environment

After going through and installing docker and running it, you should have access
to two commands: `docker` and `docker-compose`. With these, you can fully run
our test suite locally.

## Running tests locally

We can run our end-to-end tests locally using `docker-compose`. To help reduce
the amount of disk space of the volumes used during runtime, the suggested order
to run the end-to-end tests is:

```bash
docker-compose -f e2e/docker-compose.yml down -v --rmi local --remove-orphans && \
  docker-compose -f e2e/docker-compose.yml build --force-rm && \
  docker-compose -f e2e/docker-compose.yml run test
```

### Running a specific test suite

You can run a specific test suite by passing in the name of the file to the
`--test-suite` option in the run command by doing:

```bash
docker-compose -f e2e/docker-compose.yml down -v --rmi local --remove-orphans && \
  docker-compose -f e2e/docker-compose.yml build --force-rm && \
  docker-compose -f e2e/docker-compose.yml run test /toolkit/e2e/run.sh --test-suite <test-suite-name>
```
