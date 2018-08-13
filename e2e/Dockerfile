FROM node:8.11.1
MAINTAINER joshblack@us.ibm.com

RUN mkdir -p /toolkit
WORKDIR /toolkit

COPY . .
RUN yarn

CMD ["/toolkit/e2e/test.sh"]
