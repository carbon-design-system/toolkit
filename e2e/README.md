# `e2e`

## Runner

```bash
docker-compose -f e2e/docker-compose.yml down -v && \
  docker-compose -f e2e/docker-compose.yml build && \
  docker-compose -f e2e/docker-compose.yml run toolkit ./e2e/test.sh
```
