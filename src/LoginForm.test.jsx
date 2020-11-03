import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const handleClick = jest.fn();
  const handleChange = jest.fn();

  const renderLoginForm = ({ email = '' }) => render(
    <LoginForm
      onClick={handleClick}
      onChange={handleChange}
      loginFields={{ email }}
    />,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('input-controls', () => {
    const inputControls = [
      { label: 'E-mail', name: 'email', value: 'tester@example.com' },
      { label: 'Password', name: 'password', value: 'test' },
    ];

    it('are rendered', () => {
      const { queryByLabelText } = renderLoginForm({});

      inputControls.forEach(({ label }) => {
        expect(queryByLabelText(label)).not.toBeNull();
      });
    });

    it('have given value on each', () => {
      const { getByLabelText } = renderLoginForm({
        email: 'origin@example.com',
      });

      expect(getByLabelText('E-mail')).toHaveValue('origin@example.com');
    });

    it('listen change events', () => {
      const { getByLabelText } = renderLoginForm({});

      inputControls.forEach(({ label, name, value }) => {
        fireEvent.change(getByLabelText(label), {
          target: { value },
        });

        expect(handleChange).toBeCalledWith({ name, value });
      });
    });
  });

  describe('"Log In" button', () => {
    const loginButton = 'Log In';

    it('is rendered', () => {
      const { queryByText } = renderLoginForm({});

      expect(queryByText(loginButton)).not.toBeNull();
    });

    it('listens click event', () => {
      const { getByText } = renderLoginForm({});

      expect(handleClick).not.toBeCalled();

      fireEvent.click(getByText(loginButton));

      expect(handleClick).toBeCalledTimes(1);
    });
  });
});
