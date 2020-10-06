import client from './api-client';
import URLS from '../service/urls';
import { useQuery, useMutation, queryCache } from 'react-query';

function useDeckList() {
  return useQuery({
    queryKey: 'deckList',
    queryFn: () => client(URLS.getAllDecks)
  });
}

function useFlashcards(deckId) {
  return useQuery({
    queryKey: `deck ${deckId}`,
    queryFn: () => client(URLS.getDeck(deckId))
  });
}

const onDeckCreate = (responseData, deck) => {
  const prevData = queryCache.getQueryData('deckList');
  if (prevData) {
    queryCache.setQueryData(
      'deck',
      prevData.push({ name: deck.deckName, id: responseData, cardCount: 1 })
    );
  }
  return prevData;
};

function useDeckCreate() {
  return useMutation(
    (deck) => client(URLS.createDeck, { data: deck, method: 'post' }),
    {
      onSuccess: onDeckCreate,
      onError: (error, deck, prevData) => queryCache.setQueryData(prevData),
      onSettled: () => queryCache.invalidateQueries('deckList')
    }
  );
}
const onDeckDelete = (deckId) => {
  queryCache.cancelQueries('deckList');
  const prevData = queryCache.getQueryData('deckList');

  if (prevData) {
    const newDeckList = prevData.filter((deck) => deck.id !== deckId);
    queryCache.setQueryData('deckList', newDeckList);
  }
  return prevData;
};

function useDeckDelete() {
  return useMutation(
    (deckId) => client(URLS.deleteDeck(deckId), { method: 'delete' }),
    {
      onMutate: onDeckDelete,
      onError: (error, deck, prevData) => queryCache.setQueryData(prevData),
      onSettled: () => queryCache.invalidateQueries('deckList')
    }
  );
}

const onFlashcardDelete = (card) => {
  queryCache.cancelQueries(`deck ${card.deckId}`);

  const prevData = queryCache.getQueryData(`deck ${card.deckId}`);
  if (prevData) {
    queryCache.setQueryData(`deck ${card.deckId}`, {
      ...prevData,
      cards: prevData.cards.filter((deck) => deck.id !== card.id)
    });
  }
  return prevData;
};

function useFlashcardDelete() {
  return useMutation(
    (card) =>
      client(URLS.editORDeleteCard(card.deckId, card.id), { method: 'delete' }),
    {
      onMutate: onFlashcardDelete,
      onError: (error, deck, prevData) => queryCache.setQueryData(prevData)
      // onSettled: () => queryCache.invalidateQueries('deck')
    }
  );
}

const onFlashcardEdit = (card) => {
  // queryCache.invalidateQueries('deck', {
  //   refetchActive: false
  // });
  queryCache.cancelQueries(`deck ${card.deckId}`);

  const prevData = queryCache.getQueryData(`deck ${card.deckId}`);
  if (prevData) {
    function editCardInCache(cardInCache) {
      if (cardInCache.id === card.id) return { ...cardInCache, ...card };
      return cardInCache;
    }

    queryCache.setQueryData(`deck ${card.deckId}`, {
      ...prevData,
      cards: prevData.cards.map(editCardInCache)
    });
  }
  return prevData;
};

function useFlashcardEdit() {
  return useMutation(
    (card) =>
      client(URLS.editORDeleteCard(card.deckId, card.id), {
        data: card,
        method: 'put'
      }),
    {
      onMutate: onFlashcardEdit
    }
  );
}
export {
  useDeckList,
  useDeckCreate,
  useDeckDelete,
  useFlashcards,
  useFlashcardDelete,
  useFlashcardEdit
};
