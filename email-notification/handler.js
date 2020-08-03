const { EMAIL_FROM, EMAIL_TO } = process.env;

module.exports.send = async (event) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body).Message;

    console.log({
      from: `"Reservas" <${EMAIL_FROM}>`,
      to: EMAIL_TO,
      subject: "Reserva Efetuada",
      text: message,
      html: message,
    });
  }

  return {
    message: "Go Serverless v1.0! Your function executed successfully!",
    event,
  };
};
