exports.handler = async function (context, event, callback) {
  const client = context.getTwilioClient();
  const CSAT_STUDIO_FLOW_SID = context.CSAT_STUDIO_FLOW_SID;

  const {
    interactionSid,
    channelSid,
    participantSid,
    conversationSid,
    taskSid,
  } = event;

  // Create a custom Twilio Response
  const response = new Twilio.Response();
  // Set the CORS headers to allow Flex to make an error-free HTTP request
  // to this Function
  response.appendHeader('Access-Control-Allow-Origin', '*');
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (
    !interactionSid ||
    !channelSid ||
    !participantSid ||
    !conversationSid ||
    !taskSid
  ) {
    const errorMessage = `(${context.PATH}) Please provide all required parameters to continue`;
    console.error(errorMessage);
    response.appendHeader('Content-Type', 'plain/text');
    response.setBody(errorMessage);
    response.setStatusCode(500);
    return callback(null, response);
  }

  try {
    // Remove agent from the conversation
    const removeAgentResult = await client.flexApi.v1
      .interaction(interactionSid)
      .channels(channelSid)
      .participants(participantSid)
      .update({ status: 'wrapup' });

    // Set webhook to survey Studio flow
    const webhookResult = await client.conversations.v1
      .conversations(conversationSid)
      .webhooks.create({
        'configuration.method': 'POST',
        'configuration.filters': ['onMessageAdded'],
        'configuration.flowSid': CSAT_STUDIO_FLOW_SID,
        target: 'studio',
      });

    // Send message
    // When the customer replies, the Studio flow set above will receive it
    const sendCSATMessageResult = await client.conversations.v1
      .conversations(conversationSid)
      .messages.create({
        body: 'Como você avalia a sua interação com nosso agente hoje? (de 1 a 10)',
      });

    response.appendHeader('Content-Type', 'application/json');
    response.setBody(sendCSATMessageResult);
    callback(null, response);
  } catch (error) {
    const errorMessage = `(${context.PATH}) Unexpected error occurred: ${error}`;
    console.error(errorMessage);
    response.appendHeader('Content-Type', 'plain/text');
    response.setBody(errorMessage);
    response.setStatusCode(500);
    return callback(null, response);
  }
};
