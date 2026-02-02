const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const ssmClient = new SSMClient({
  region: "us-east-1",
});

async function getSSMParameter(name) {
  const command = new GetParameterCommand({
    Name: name,
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);

  if (!response.Parameter || !response.Parameter.Value) {
    throw new Error(`SSM parameter not found: ${name}`);
  }

  return response.Parameter.Value;
}

module.exports = { getSSMParameter };