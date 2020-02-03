import React, { useState, Dispatch, SetStateAction } from 'react';
import { FormValues } from './addEditForm.types';
import { Container, Form, Button } from 'react-bootstrap';
import FormHeading from './FormHeading';
import ImageInput from './ImageInput';
import ImageSearch from '../imagesearch/ImageSearch';

type Props = {
  formValue: FormValues;
  formHeading: string;
  subheading?: string;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.FormEvent) => void;
  /** Input component from ./DeckNameInputs */
  DeckNameInput: React.ReactElement;
  setFormValue: Dispatch<SetStateAction<FormValues>>;
  snackBar?: React.ReactNode;
};

export default function FlashcardForm({
  formValue,
  formHeading,
  subheading = null,
  handleSubmit,
  handleChange,
  DeckNameInput,
  setFormValue,
  snackBar
}: Props) {
  const [searchToggle, setToggle] = useState(false);

  return (
    <div className="w-100 h-100 position-relative">
      <Container className="d-flex flex-column align-items-center p-1 pt-3">
        <FormHeading heading={formHeading} subheading={subheading} />
        <div className="col-11 p-0 d-flex justify-content-center align-items-center align-items-md-start">
          <Form
            className="col-9 col-md-7 col-lg-6 p-0 pt-md-5"
            onSubmit={handleSubmit}
          >
            <Form.Group controlId="editDeckName">
              <Form.Label>Deck Name:</Form.Label>
              {DeckNameInput}
            </Form.Group>
            <Form.Group controlId="frontOfFlashcard">
              <Form.Label>Front:</Form.Label>
              <Form.Control
                required
                name="frontOfCard"
                value={formValue.frontOfCard}
                type="text"
                placeholder="front of card"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="selectImage">
              <Form.Label>Image:</Form.Label>
              <ImageInput
                searchToggle={searchToggle}
                setToggle={setToggle}
                image={formValue.cardImage}
              />
            </Form.Group>
            <Form.Group controlId="BackOfFlashcard">
              <Form.Label>Back:</Form.Label>
              <Form.Control
                required
                name="backOfCard"
                value={formValue.backOfCard}
                type="text"
                placeholder="Back of card"
                onChange={handleChange}
              />
            </Form.Group>
            <Button className="col-12" variant="secondary" type="submit">
              Submit
            </Button>
          </Form>
          {snackBar}
        </div>
      </Container>
      <ImageSearch
        searchToggle={searchToggle}
        setToggle={setToggle}
        formValue={formValue}
        setFormValue={setFormValue}
      />
    </div>
  );
}
