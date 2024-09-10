import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';

import { SendCSATButton } from './components/SendCSATButton/SendCSATButton';
import './notifications';
import './actions';
import { CustomizationProvider } from '@twilio-paste/core/dist/customization';

const PLUGIN_NAME = 'ChatCsatPlugin';

export default class ChatCsatPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    flex.TaskCanvasHeader.Content.add(
      <SendCSATButton key="send-csat-button" />,
      {
        sortOrder: 1,
        if: (props) =>
          props.channelDefinition.capabilities.has('Chat') &&
          props.task.taskStatus === 'assigned',
      }
    );
  }
}
