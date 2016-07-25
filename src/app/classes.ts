export class Card {
  id: any;
  name: any;
  url: any;
  manaCost: any;
  type: any;
  wording: any;
  artist: any;
  num: any;
  power: any;
  toughness: any;
  primaryTypes: any;
  superTypes: any;
  subTypes: any;
  setType: any;

  constructor( data: any ) {
    this.id = data.id;
    this.name = data.name;
    this.url = data.url;
    this.manaCost = data.mana_cost;
    this.type = data.full_type;
    this.rarity = data.rarity;
    this.wording = data.wording;
    this.artist = data.artist;
    this.num = data.num;
    this.power = (parseInt(data.power, 10)) || null;
    this.toughness = (parseInt(data.toughness, 10)) || null;
    this.converted = data.converted;
    this.primaryTypes = data.primary_types;
    this.superTypes = data.super_types;
    this.subTypes = data.sub_types;
    this.setType = 'M15';
  
    data.colors.forEach(color => this[color] = true);
  }
}

export class DeckList {
  collection: any;

  constructor( deckList = []  ) {
    this.collection = [];
    deckList = deckList.filter(deck => deck);

    deckList.forEach(deck => {
      deck.cards = 
        deck.cards.reduce(
          (acc, value) => {
            if (acc[value]) {
              acc[value] += 1;
            } else {
              acc[value] = 1;
            }

            return acc;
          },
        {});
      this.collection.push(deck);
    });
  }
  
  get() {
    return this.collection;
  }
}

export class AppModel {
  currentDeck: any;
  profile: any;
  cache: any;
  model: any;

  constructor() {
    this.cache = {};
    this.profile = {
      name: '',
      id: '',
      deckList : []
    };
    this.currentDeck = {
      id: '',
      deck_name: 'Unnamed New Deck',
      cards: {}
    };
    this.model = [];
  };
}