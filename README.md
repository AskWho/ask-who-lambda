ask-who-lambda
============

`ask-who-lambda` is the AWS lambda function to interface with Facebook messenger.

## Get Started
You need to create a `.env` file with the following:
```
AWS_KEY=<SOME_AWS_KEY>
AWS_SECRET=<SOME_AWS_SECRET>
SECRET=<SOME_ENCRYPTION_SECRET>
STAGE=dev
```
where
- `<SOME_AWS_KEY>` and `<SOME_AWS_SECRET>` are the credential to your AWS IAM serverless user,
- `<SOME_ENCRYPTION_SECRET>` is the secret to decrypt `secrets.dev.yml.encrypted`.

### Setup AWS credentials and decrypt configuration secrets
```
npm run init
```

### Deploy
```
npm run deploy
```

### Remove
```
npm run remove
```
