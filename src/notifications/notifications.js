import { Notifications, NotificationType } from '@twilio/flex-ui'

Notifications.registerNotification({
  id: 'csatSentNotification',
  closeButton: true,
  content: 'CSAT was sent successfully!',
  timeout: 3000,
  type: NotificationType.success
})

Notifications.registerNotification({
  id: 'errorSendCSATNotification',
  closeButton: true,
  content: 'An error has ocurred sending CSAT survey',
  timeout: 3000,
  type: NotificationType.error
})
