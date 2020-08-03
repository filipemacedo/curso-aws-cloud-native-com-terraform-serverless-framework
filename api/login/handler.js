const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { AWS_REGION, DYNAMODB_USERS, EMAIL_GSI, JWT_SECRET } = process.env;

AWS.config.update({
  region: AWS_REGION,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

async function handleLogin(event) {
  const body = JSON.parse(event.body);

  const params = {
    TableName: DYNAMODB_USERS,
    IndexName: EMAIL_GSI,
    KeyConditionExpression: 'email = :email',
    Limit: 1,
    ExpressionAttributeValues: {
      ':email': body.email
    }
  };

  const { Items } = await documentClient.query(params).promise();
  const [user] = Items;
  
  if (user) {
    const passwordIsValid = await bcrypt.compare(body.password, user.password);

    if (passwordIsValid) {
      delete user.password;

      return {
        statusCode: 200,
        body: JSON.stringify({ token: jwt.sign(user, JWT_SECRET)})
      }
    }
  }

  return {
    statusCode: 401,
    body: JSON.stringify({ message: "Usuário ou senha inválidos!" })
  }
}

module.exports.login = handleLogin;
