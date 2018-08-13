FROM node:8.11.1
MAINTAINER joshblack@us.ibm.com

RUN mkdir -p /toolkit
WORKDIR /toolkit

COPY . .
RUN yarn

RUN ls -al
RUN pwd

CMD ["/toolkit/e2e/test.sh"]
