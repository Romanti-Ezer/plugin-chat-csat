import React, { useState } from 'react';
import styled from 'styled-components';
import { Actions } from '@twilio/flex-ui';

import { CustomIcon } from '@twilio-paste/icons/esm/CustomIcon';
import { Spinner } from '@twilio-paste/core/spinner';

const IconWrapper = styled.div`
  margin: 0.8rem;
  cursor: ${(props) => (props.isLoading ? 'not-allowed' : 'pointer')};
`;

export const SendCSATButton = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        <IconWrapper isLoading={isLoading}>
          <Spinner size="sizeIcon40" decorative={false} title="Loading" />
        </IconWrapper>
      ) : (
        <IconWrapper
          onClick={() => {
            setIsLoading(true);
            Actions.invokeAction('SendCSAT', { task: props.task });
          }}
        >
          <CustomIcon
            decorative={false}
            title="Send CSAT Survey"
            size="sizeIcon40"
          />
        </IconWrapper>
      )}
    </>
  );
};
