"use strict";

const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");

const { AWS_REGION, DYNAMODB_USERS } = process.env;

AWS.config.update({
  region: AWS_REGION,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

async function handleRegister(event) {
  const body = JSON.parse(event.body);

  await documentClient
    .put({
      TableName: DYNAMODB_USERS,
      Item: {
        id: uuid.v4(),
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
      },
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({ message: "Usuário inserido com sucesso!" }),
  };
}

module.exports.register = handleRegister;
