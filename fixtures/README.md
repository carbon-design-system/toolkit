# fixtures

## Overview

Fixtures present in this directory are used for sanity-checking various CLI
commands like `add`, `create`, etc.

The pattern is for each fixture to have a `test.sh` utility that you can use to
run the fixture, in addition to providing options to customize how the fixture
runs. For most, the following command will be a good start for getting started:

```bash
cd <some-fixture>
./test.sh --verbose
```
