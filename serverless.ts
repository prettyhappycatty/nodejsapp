import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'lambda-handson-miyuki-19820830',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: [
    'serverless-webpack'],
  provider: {
    region: 'ap-northeast-1',
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DYNAMODB_TABLE: '${self:service}-${self:provider.stage}',
      TODO_TABLE: '${self:provider.environment.DYNAMODB_TABLE}-todo',
    },
    iam:{
      role:{
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource:
              'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}*',
          },
        ],
      },
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    getTodos: {
      handler: 'handler.getTodos',
      events: [
        {
          http: {
            method: 'get',
            path: 'todos',
          },
        },
      ],
    },
    createTodo: {
      handler: 'handler.createTodo',
      events: [
        {
          http: {
            method: 'post',
            path: 'todos',
          },
        },
      ],
    },
    updateTodo: {
      handler: 'handler.updateTodo',
      events: [
        {
          http: {
            method: 'put',
            path: 'todos/{id}',
          },
        },
      ],
    },
    deleteTodo: {
      handler: 'handler.deleteTodo',
      events: [
        {
          http: {
            method: 'delete',
            path: 'todos/{id}',
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      Todo: {
        // @ts-ignore
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.TODO_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
