import { Actions, TaskHelper, Manager, Notifications } from '@twilio/flex-ui';
import fetch from 'node-fetch';

const URL_SEND_CSAT_SURVEY = process.env.FLEX_APP_URL_SEND_CSAT_SURVEY;

const getAgent = async (payload) => {
  const participants = await payload.task.getParticipants(
    payload.task.attributes.flexInteractionChannelSid
  );

  let agent;
  for (const p of participants) {
    if (p.type === 'agent') {
      agent = p;
      break;
    }
  }

  return agent;
};

const sendCSAT = async (payload, original) => {
  if (!TaskHelper.isCBMTask(payload.task)) {
    return original(payload);
  }

  const agent = await getAgent(payload);

  const body = {
    interactionSid: agent.interactionSid,
    channelSid: agent.channelSid,
    participantSid: agent.participantSid,
    conversationSid: agent.mediaProperties.conversationSid,
    taskSid: payload.task.taskSid,
  };

  try {
    await fetch(URL_SEND_CSAT_SURVEY, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(body),
    });

    return Notifications.showNotification('csatSentNotification');
  } catch (error) {
    console.error(error);

    return Notifications.showNotification('errorSendCSATNotification');
  }
};

Actions.registerAction('SendCSAT', (payload, original) =>
  sendCSAT(payload, original)
);
