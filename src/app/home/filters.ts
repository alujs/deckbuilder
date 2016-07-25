import * as _ from 'lodash';

var equality = (a, b) => { return a === b };

var fuzzyWord = (a, b) => {
  if(a === null) {
    return false;
  }

  return a.toLowerCase().indexOf(b.toLowerCase()) > -1;
};

var includesArr = (a, b) => {
  return (_.difference(a, b)).length < a.length;
};

var includesText = (a, b) => {

  return _.includes(a, b);
};

var filters = {};

filters.converted = equality;
filters.toughness = equality;
filters.power = equality;
filters.rarity = equality;
filters.colors = includesArr;
filters.primaryTypes = includesText;
filters.subTypes = includesText;
filters.wording = fuzzyWord;
filters.name = fuzzyWord;
filters.set = equality;

export {filters};