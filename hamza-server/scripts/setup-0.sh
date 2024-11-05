./scripts/import-currencies.sh
yarn up
node ./scripts/init-search-api.js
yarn build
medusa migrations run
yarn seed
yarn dev
