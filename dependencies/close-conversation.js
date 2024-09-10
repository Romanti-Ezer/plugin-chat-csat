exports.handler = function (context, event, callback) {
  const client = context.getTwilioClient();
  const conversationSid = event.conversationSid;

  client.conversations.v1
    .conversations(conversationSid)
    .update({ state: 'closed' })
    .then((response) => {
      callback(null, response);
    })
    .catch((error) => {
      callback(error);
    });
};
