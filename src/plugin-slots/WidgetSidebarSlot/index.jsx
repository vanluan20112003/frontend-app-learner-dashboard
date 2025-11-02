import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import LookingForChallengeWidget from 'widgets/LookingForChallengeWidget';
import GeneralChatWidget from 'widgets/GeneralChatWidget';

// eslint-disable-next-line arrow-body-style
export const WidgetSidebarSlot = () => (
  <PluginSlot
    id="org.openedx.frontend.learner_dashboard.widget_sidebar.v1"
    idAliases={['widget_sidebar_slot']}
  >
    <LookingForChallengeWidget />
    <GeneralChatWidget />
  </PluginSlot>
);

export default WidgetSidebarSlot;
