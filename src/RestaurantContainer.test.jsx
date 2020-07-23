import React from 'react';

import { render, fireEvent } from '@testing-library/react';

import { useDispatch, useSelector } from 'react-redux';

import RestaurantContainer from './RestaurantContainer';
import { changeReviewField } from './actions';

describe('RestaurantContainer', () => {
  const dispatch = jest.fn();

  function renderRestaurantContainer() {
    return render(<RestaurantContainer restaurantId="1" />);
  }

  beforeEach(() => {
    dispatch.mockClear();
    useDispatch.mockImplementation(() => dispatch);

    useSelector.mockImplementation((selector) => selector({
      restaurant: given.restaurant,
      accessToken: given.accessToken,
      reviewFields: {
        score: '',
        description: '',
      },
    }));
  });

  it('dispatches action', () => {
    renderRestaurantContainer();

    expect(dispatch).toBeCalled();
  });

  context('with restaurant', () => {
    given('restaurant', () => ({
      id: 1,
      name: '마법사주방',
      address: '서울시 강남구',
      reviews: [
        {
          id: 1, name: 'Tester', score: '5', description: 'Best!',
        },
      ],
    }));

    it('renders name and address and reviews', () => {
      const { container } = renderRestaurantContainer();

      expect(container).toHaveTextContent('마법사주방');
      expect(container).toHaveTextContent('서울시');
      expect(container).toHaveTextContent('Best!');
    });

    context('when logged in', () => {
      given('accessToken', () => 'ACCESS_TOKEN');

      it('renders review input form', () => {
        const { container } = renderRestaurantContainer();

        expect(container).toHaveTextContent('평점');
        expect(container).toHaveTextContent('리뷰 내용');
      });

      it('listens change events', () => {
        const { getByLabelText } = renderRestaurantContainer();

        const controls = [
          { label: '평점', name: 'score', value: '5' },
          { label: '리뷰 내용', name: 'description', value: 'good!' },
        ];

        controls.forEach(({ label, name, value }) => {
          fireEvent.change(getByLabelText(label), {
            target: { value },
          });

          expect(dispatch).toBeCalledWith(changeReviewField({ name, value }));
        });
      });

      it('listens click event', () => {
        const { getByText } = renderRestaurantContainer();

        fireEvent.click(getByText('리뷰 남기기'));

        expect(dispatch).toBeCalledTimes(2);
      });
    });
  });

  context('when logged out', () => {
    given('accessToken', () => '');

    it('doesn\'t render review input form', () => {
      const { container } = renderRestaurantContainer();

      expect(container).not.toHaveTextContent('평점');
      expect(container).not.toHaveTextContent('리뷰 내용');
    });
  });

  context('without restaurant', () => {
    given('restaurant', () => null);

    it('renders loading', () => {
      const { container } = renderRestaurantContainer();

      expect(container).toHaveTextContent('Loading');
    });
  });
});