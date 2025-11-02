import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import GeneralChatWidget from './index';

const IntlWrapper = ({ children }) => (
  <IntlProvider locale="en" messages={{}}>
    {children}
  </IntlProvider>
);

describe('GeneralChatWidget', () => {
  it('renders the widget with title', () => {
    render(
      <IntlWrapper>
        <GeneralChatWidget />
      </IntlWrapper>
    );
    expect(screen.getByText('General Chat')).toBeInTheDocument();
  });

  it('toggles expand/collapse when clicking the expand button', () => {
    render(
      <IntlWrapper>
        <GeneralChatWidget />
      </IntlWrapper>
    );

    const chatBody = screen.getByText(/Connect with other learners/i);
    expect(chatBody).toBeInTheDocument();

    // Click collapse button
    const collapseButton = screen.getByRole('button', { name: /collapse/i });
    fireEvent.click(collapseButton);

    // Chat body should be hidden
    expect(screen.queryByText(/Connect with other learners/i)).not.toBeInTheDocument();
  });

  it('opens and closes chat when clicking buttons', () => {
    render(
      <IntlWrapper>
        <GeneralChatWidget />
      </IntlWrapper>
    );

    // Initially chat is closed, showing preview
    expect(screen.getByText('Open Chat')).toBeInTheDocument();

    // Click open chat button
    const openButton = screen.getByText('Open Chat');
    fireEvent.click(openButton);

    // Chat should be open
    expect(screen.getByPlaceholderText(/Type a message/i)).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByRole('button', { name: /close chat/i });
    fireEvent.click(closeButton);

    // Should return to preview
    expect(screen.getByText('Open Chat')).toBeInTheDocument();
  });
});
