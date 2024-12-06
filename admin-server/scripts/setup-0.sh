./scripts/import-currencies.sh
yarn up
yarn build
medusa migrations run
yarn seed
yarn dev
