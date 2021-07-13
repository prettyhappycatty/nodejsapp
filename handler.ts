import 'source-map-support/register';
import { APIGatewayProxyHandler } from 'aws-lambda';

import { DynamoDB } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

const dynamo = new DynamoDB.DocumentClient();

const findAllTodo = () => {
  const params = { TableName: process.env.TODO_TABLE };
  return dynamo.scan(params).promise();
};

const putTodo = ({ id, text }) => {
  const params = {
    TableName: process.env.TODO_TABLE,
    Item: { id, text },
  };
  return dynamo.put(params).promise();
};

const removeTodo = ({ id }) => {
  const params = {
    TableName: process.env.TODO_TABLE,
    Key: { id },
  };
  return dynamo.delete(params).promise();
};

export const getTodos: APIGatewayProxyHandler = async () => {
  const result = await findAllTodo();
  console.log(result);
  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
};

export const createTodo: APIGatewayProxyHandler = async event => {
  const id = uuid();
  const text = JSON.parse(event.body).text;
  const result = await putTodo({ id, text });
  console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify({ result }),
  };
};

export const updateTodo: APIGatewayProxyHandler = async event => {
  const id = event.pathParameters.id;
  const text = JSON.parse(event.body).text;
  const result = await putTodo({ id, text });
  console.log(result);
  return {
    statusCode: 200,
    body: JSON.stringify({ result }),
  };
};

export const deleteTodo: APIGatewayProxyHandler = async event => {
  const id = event.pathParameters.id;
  const result = await removeTodo({ id });
  console.log(result);
  return {
    statusCode: 204,
    body: null,
  };
};
