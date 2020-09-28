import React from 'react';
import renderWithRedux from '../utils/testWithRedux';
import App from '../App';
import {
  prettyDOM,
  waitForElementToBeRemoved,
  waitForElement,
  fireEvent
} from '@testing-library/react';
import { makeServer } from '../server';
import userEvent from '@testing-library/user-event';

let server;

beforeEach(() => {
  server = makeServer();
});

afterEach(() => {
  server.shutdown();
});

it('should add new deck to DB and navigate to "Add New Card" page', async () => {
  server.createList('deck', 1);
  const { getByTestId, getByLabelText, history, container } = renderWithRedux(
    <App />,
    {
      route: '/add/newdeck'
    }
  );
  await waitForElementToBeRemoved(() => getByTestId('loading'));

  userEvent.type(getByLabelText(/deck/i), 'Test Deck');
  userEvent.type(getByLabelText(/Front/i), 'front text');
  userEvent.type(getByLabelText(/Back/i), 'back text');
  fireEvent.submit(container.querySelector('form'));
  await waitForElementToBeRemoved(() => getByTestId('deck-name-input'));

  expect(server.db.decks.length).toBe(2);
  expect(history.location.pathname).toContain('add/card');
});

it.skip('should add 1 new card to "Test Deck 1"', async () => {
  server.createList('deck', 3);
  const {
    getByTestId,
    getByText,
    container,
    getByLabelText,
    store
  } = renderWithRedux(<App />, { route: '/add/card' });
  await waitForElementToBeRemoved(() => getByTestId('loading'));

  userEvent.selectOptions(
    getByTestId('deck-name-select'),
    getByText(/test deck 1/i)
  );

  userEvent.type(getByLabelText(/Front/i), 'front text');
  userEvent.type(getByLabelText(/Back/i), 'back text');
  fireEvent.submit(container.querySelector('form'));
  const deck = server.db.decks.findBy({ name: 'Test Deck 1' });
  const flashcards = server.db.flashcards.findBy({ deckId: deck.id });
});