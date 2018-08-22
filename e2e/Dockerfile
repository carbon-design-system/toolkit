FROM node:8.11.4
MAINTAINER joshblack@us.ibm.com

RUN mkdir -p /toolkit
WORKDIR /toolkit

COPY yarn.lock package.json lerna.json .yarnrc ./
COPY .yarn-offline-mirror ./.yarn-offline-mirror
COPY node_modules ./node_modules

RUN yarn install --offline --frozen-lockfile

COPY packages ./packages
COPY .git ./.git
COPY e2e ./e2e

CMD ["/toolkit/e2e/run.sh"]
