const AWS = require("aws-sdk");
const uuid = require("uuid");

AWS.config.update({
  region: process.env.AWS_REGION,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports.create = async (event) => {
  const body = JSON.parse(event.body);
  const { authorizer } = event.requestContext;

  if (authorizer.role !== "ADMIN") {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: "Você não pode prosseguir com essa solicitação.",
      }),
    };
  }

  await documentClient
    .put({
      TableName: process.env.DYNAMODB_BOOKINGS,
      Item: {
        id: uuid.v4(),
        date: body.date,
        user: authorizer,
      },
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Agendamento efetuado com sucesso." }),
  };
};
