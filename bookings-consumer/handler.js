const AWS = require("aws-sdk");
const moment = require("moment");

AWS.config.update({
  region: process.env.AWS_REGION,
});

moment.locale("pt-br");

const SNS = new AWS.SNS();
const converter = AWS.DynamoDB.Converter;

module.exports.listen = async (event) => {
  const snsPromises = [];

  for (const record of event.Records) {
    if (record.eventName !== "INSERT") {
      break;
    }

    const row = converter.unmarshall(record.dynamodb.NewImage);

    const message = `Boa noite ${
      row.user.name
    }, a sua reserva para o Santorini Princess Spa Hotel está concluida. Até ${moment(
      row.date
    ).format("LLLL")} `;

    snsPromises.push(
      SNS.publish({
        TopicArn: process.env.SNS_NOTIFICATIONS_TOPIC,
        Message: message,
      }).promise()
    );
  }

  await Promise.all(snsPromises);

  console.log("Mensagem(ns) enviada(s) com sucesso!")

  return {
    message: "Go Serverless v1.0! Your function executed successfully!",
    event,
  };
};
