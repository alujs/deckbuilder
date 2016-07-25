function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export class ChangeDeck {
  constructor( public deckId ) {

  }

  update( state ) {
    state.currentDeck = state.profile.deckList
      .filter(deck => deck.id === this.deckId)[0];
    return state;
  }
}

export class AddDeck {
  
  constructor() {

  }

  update( state: any ) {
    state.currentDeck = {
      id: null,
      deck_name: 'Deck name...',
      cards: {}
    }

    return state;
  }
}

class DeletionReply {

  constructor( public reply ) {}

  update( state ) {
    state.currentDeck = state.profile.deckList[0] || {
      id: null,
      deck_name: 'Create a new deck...',
      cards: {}
    };

    state.profile.deckList = state.profile.deckList
      .filter(deck => deck.id !== this.reply);

    return state; 
  }
}

export class RemoveDeck {

  constructor(
    public user_id,
    public deck_id,
    public commService,
    public http
  ) {}

  update(state) {
    return state;
  }

  run() {
    this.http
      .post('localhost/decks', {
        deck_id: this.deck_id,
        user_id: this.user_id,
        method: 'edit'
      })
      .subscribe(data => {
        this.commService.next(new DeletionReply(data._body));
      });
  }
}

class SaveReply {

  constructor( public reply, public deckName ) {}

  update( state ) {
    var newDeck = false;

    if(state.currentDeck.id === null || state.currentDeck.id === '') {
      newDeck = true;
    }

    state.profile.deckList.forEach((deck, index, list) => {
      if (deck.id === this.reply) {
        list[index] = state.currentDeck;
      }
    });
    
    state.currentDeck.id = this.reply;
    state.currentDeck.deck_name = this.deckName;

    if(newDeck) {
      state.profile.deckList.push(state.currentDeck);
    }
    
    return state;
  }
}

export class SaveDeckChanges {
  deck: any;

  constructor(
    public deckName,
    public deckList,
    public user_id,
    public commService,
    public http
   ) {
    
    this.deck = [];
    for(var card in deckList.cards) {
      this.deck.push({
        card: card,
        deck_name: deckName
      });
    }
  }

  update( state ) {
    return state;
  }

  run() {
    this.http
      .post('localhost/decks', {
        deck_id: this.deckList.id || null,
        user_id: this.user_id,
        deck: this.deck,
        method: 'edit'
      })
      .subscribe(data => {
        this.commService.next(new SaveReply(data._body, this.deckName));
      });
  }
}