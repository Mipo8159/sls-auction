1. deploy stack -> sls deploy --verbose
2. deploy function -> sls deploy -f createAuction --verbose
3. sls logs -f processAuctions --tail / (--startTime 1m)
4. sls invoke -f processAuctions --log
