(function(_) {
  'use strict';

  var tkDataStore = window.tkDataStore = window.tkDataStore || {};

  tkDataStore.moduelSource = {
    local: {
      basic: 'data/basic.csv',
      advanced: 'data/advanced.csv',
    },
    cloud: {
      basic: '19gKrd4RpiU7evbYe-Bb8XJ18B7yzaD_ZqHlOFEMFu04',
      advanced: '1HnqeQtNhuqWvEJau5VINIn4DhivCSvLD5C3w4dLz5TA',
    },
    download: {
      basic: 'https://docs.google.com/spreadsheets/d/19gKrd4RpiU7evbYe-Bb8XJ18B7yzaD_ZqHlOFEMFu04/pub?gid=0&single=true&output=csv',
      advanced: 'https://docs.google.com/spreadsheets/d/1HnqeQtNhuqWvEJau5VINIn4DhivCSvLD5C3w4dLz5TA/pub?gid=0&single=true&output=csv',
    }
  };

  tkDataStore.questionModules = {
    basic: {},
    advanced: {},
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