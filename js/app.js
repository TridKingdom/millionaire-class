var csvSource = {
  local: {
    'basic': 'data/basic.csv',
    'europe': 'data/europe.csv',
    'taiwan': 'data/taiwan.csv',
  },
  drive: {
    'basic': 'https://docs.google.com/spreadsheets/d/193O-BB0Z4lESRCLHWkJX8nU2SmhavMnNX5gHJiSCVp8/export?format=csv',
    'europe': 'https://docs.google.com/spreadsheets/d/193O-BB0Z4lESRCLHWkJX8nU2SmhavMnNX5gHJiSCVp8/export?format=csv',
    'taiwan': 'https://docs.google.com/document/d/1j3z7_E8xhprMX2yT3rHnkA37jWKtJTbfyDmk0oDej9M/export',
  }
};

var questionModules = {
  basic: {},
  europe: {},
  taiwan: {},
};



function _getQuestionModules(moduleName, callback) {
  $.ajax({
    url: csvSource.local[moduleName],
    type: 'GET',
  })
  .then(function(csvString) {
      questionModules[moduleName] = Papa.parse(csvString, {header: true}).data;
      return questionModules[moduleName];
  })
  .then(callback)
  .fail(function() {
    console.log('Fail loading question module <' + moduleName + '> , please try another one');
  });
}


_getQuestionModules('basic', function(questions) {
  var $container = $('.reveal');
  var $slides = $('.reveal .slides');

  $.each(questions, function(index, question) {
    var answerOption = 'option' + question.answer;
    var template =
      '<section data-transition="slide-in fade-out">' +
        '<section data-transition="slide-in fade-out">' +
          '<h3 class="fragment grow" data-fragment-index="1">' + question.question + '</h3>' +
          '<article class="fragment tk-answers-container clearfix" data-fragment-index="2">' +
            '<h3 class="tk-answer"><strong>1</strong> ' + question.option1 + '</h3>' +
            '<h3 class="tk-answer"><strong>2</strong> ' + question.option2 + '</h3>' +
            '<h3 class="tk-answer"><strong>3</strong> ' + question.option3 + '</h3>' +
            '<h3 class="tk-answer"><strong>4</strong> ' + question.option4 + '</h3>' +
          '</article>' +
        '</section>' +
        '<section data-transition="slide-in fade-out">' +
          '<h2 class="tk-title"><strong>' + question.answer + '</strong> ' + question[answerOption] + '</h2>' +
          '<img class="tk-answer-img" data-src="' + question.image + '" alt="' + '" />' +
          '<p class="tk-answer-info">' + question.info + '</p>' +
        '</section>' +
      '</section>';

    $slides.append(template);
  });
});