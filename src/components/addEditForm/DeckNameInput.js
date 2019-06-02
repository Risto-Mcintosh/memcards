import React from "react";
import { Form } from "react-bootstrap";

export default function DeckNameInput({ handleChange, value, url, decks }) {
  const newDeckNameInput = (
    <Form.Control
      required
      value={value}
      name="deckName"
      type="text"
      placeholder="Deck Name"
      onChange={handleChange}
    />
  );

  const DeckNameReadOnly = (
    <Form.Control
      plaintext
      readOnly
      className="border-bottom"
      value={value}
      name="deckName"
    />
  );

  const editableDecks = decks.filter(deck => deck.editable === true);
  const DeckSelectInput = (
    <Form.Control
      as="select"
      required
      value={value}
      name="deckName"
      type="text"
      placeholder="Deck Name"
      onChange={handleChange}
    >
      <option />
      {editableDecks.map(deck => (
        <option value={deck.name} key={deck._id}>
          {deck.name}
        </option>
      ))}
    </Form.Control>
  );

  return url.path === "/add/newdeck"
    ? newDeckNameInput
    : url.path === "/edit/card/:cardId"
    ? DeckNameReadOnly
    : DeckSelectInput;
}