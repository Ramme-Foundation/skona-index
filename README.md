# Skona index

# Develop

```
yarn install && yarn start

```

You need to use ngrok or simular program to be able to map slack commands to your local environment

If you don't see changes when using slack commands, try saving slack-handler.ts since that needs to rebuild for changes to take affect.

# Migrate database

For dev, change .env variable to prod variable and run

```
yarn prisma migrate dev
```

For prod, change .env variable to prod variable and run

```
yarn prisma migrate deploy
```
