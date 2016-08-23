(function(_) {
  'use strict';

  var tkDataStore = window.tkDataStore = window.tkDataStore || {};

  // var googleDriveCsvUrl = 'https://docs.google.com/spreadsheets/d/1HnqeQtNhuqWvEJau5VINIn4DhivCSvLD5C3w4dLz5TA/pub?gid=0&single=true&output=csv';

  tkDataStore.moduelSource = {
    local: {
      basic: 'data/basic.csv',
      advanced: 'data/advanced.csv',
      aisa: 'data/aisa.csv',
      europe: 'data/europe.csv',
      africa: 'data/africa.csv',
      southAmerica: 'data/south-america.csv',
      northAmerica: 'data/north-america.csv',
    },
    cloud: {
      basic: '19gKrd4RpiU7evbYe-Bb8XJ18B7yzaD_ZqHlOFEMFu04',
      advanced: '1HnqeQtNhuqWvEJau5VINIn4DhivCSvLD5C3w4dLz5TA',
      aisa: 'xxx',
      europe: 'xxx',
      africa: 'xxx',
      southAmerica: 'xxx',
      northAmerica: 'xxx',
    }
  };

  tkDataStore.questionModules = {
    basic: {},
    advanced: {},
    aisa: {},
    europe: {},
    africa: {},
    southAmerica: {},
    northAmerica: {},
  };

  tkDataStore.decisionText = {
    yes: '你真了不起',
    no: '再接再厲吧',
  };

  tkDataStore.config = {
    title: '',
    source: 'cloud',
    player: '1',
    timer: 60,
  };

})(window._);