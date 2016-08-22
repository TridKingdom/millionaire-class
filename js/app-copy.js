(function($, _, Papa) {
  // /* =============================================================================
  //  *
  //  * [Data Initialization Block]
  //  * The following data would be used accross the application
  //  * Notice They are global and would be polluted if use it in a sloppy way
  //  *
  //  * ========================================================================== */

  var csvSource = {
    local: {
      'basic': 'data/basic.csv',
      'taiwan': 'data/taiwan.csv',
      'world': 'data/world.csv',
    },
    drive: {
      'basic': 'https://docs.google.com/spreadsheets/d/193O-BB0Z4lESRCLHWkJX8nU2SmhavMnNX5gHJiSCVp8/export?format=csv',
      'taiwan': 'https://docs.google.com/document/d/1j3z7_E8xhprMX2yT3rHnkA37jWKtJTbfyDmk0oDej9M/export',
      'world': 'https://docs.google.com/spreadsheets/d/193O-BB0Z4lESRCLHWkJX8nU2SmhavMnNX5gHJiSCVp8/export?format=csv',
    }
  };

  var questionModules = {
    basic: {},
    taiwan: {},
    world: {},
  };


  // /* =============================================================================
  //  *
  //  * [Functions Definition Block]
  //  * The following functions would be called later on
  //  *
  //  * Underscore function means it would be running internally
  //  * Public functions would be called directlly in html
  //  *
  //  * ========================================================================== */

  // /* =============================================================================
  //  * [Public Functions]
  //  * ========================================================================== */

  function activate() {

  }

  function loadQuestionModule(moduleName) {
    return _buildModule(moduleName)
      .then(function() {
        window.location.href = window.location.origin + window.location.pathname + '#/slide-ready';
      })
      .fail(function() {
        window.location.href = window.location.origin + window.location.pathname;
        console.log('Fail loading question module <' + moduleName + '> , please try another one');
      });
  }

  // /* =============================================================================
  //  * [Private Functions]
  //  * ========================================================================== */

  function _buildModule(moduleName) {
    return _fetchQuestionModule(moduleName)
      .then(_parseQuestionModule)
      .then(_compileQuestionsSlides)
      .then(_updateSlides);
  }

  function _fetchQuestionModule(moduleName) {
    return $.ajax({
      url: csvSource.local[moduleName],
      type: 'GET',
    })
    .then(function(csvString) {
      return {
        name: moduleName,
        csv: csvString,
      };
    })
    .fail(function() {
      console.log('Fail loading question module <' + moduleName + '> , please try another one');
    });

  }

  function _parseQuestionModule(module) {
    questionModules[module.name] = Papa.parse(module.csv, {header: true}).data;
    return questionModules[module.name];
  }

  function _compileQuestionsSlides(questions) {
    var slides =
      '<section id="slide-ready" class="js-question-set"' +
        'data-transition="zoom-in zoom-out" data-background="#4D7E65" data-background-transition="zoom">' +
        '<h1>那就開始囉！</h1>' +
      '</section>';

    $.each(questions, function(index, question) {
      var answerOption = 'option' + question.answer;
      var template =
        '<section data-transition="convex-in convex-out" class="js-question-set">' +
          '<section data-transition="slide-in slide-out">' +
            '<h3 class="fragment grow" data-fragment-index="1">' + question.question + '</h3>' +
            '<article class="fragment tk-answers-container clearfix" data-fragment-index="1">' +
              '<h3 class="tk-answer"><strong>1</strong> ' + question.option1 + '</h3>' +
              '<h3 class="tk-answer"><strong>2</strong> ' + question.option2 + '</h3>' +
              '<h3 class="tk-answer"><strong>3</strong> ' + question.option3 + '</h3>' +
              '<h3 class="tk-answer"><strong>4</strong> ' + question.option4 + '</h3>' +
            '</article>' +
          '</section>' +
          '<section data-transition="slide-in slide-out">' +
            '<h2 class="tk-title"><strong>' + question.answer + '</strong> ' + question[answerOption] + '</h2>' +
            '<img class="tk-answer-img" data-src="' + question.image + '" alt="' + '" />' +
            '<p class="tk-answer-info">' + question.info + '</p>' +
          '</section>' +
        '</section>';

      var $template = $('<div />', {html:template});

      $template
        .find('.tk-answer')
          .eq(question.answer - 1)
            .addClass('fragment highlight-blue')
            .data('fragment-index', 2);

      slides += $template.html();
    });

    return slides;
  }

  function _updateSlides(slides) {
     $('.reveal .slides .js-question-set').remove();
     $('#slide-index').after(slides);
  }


  // /* =============================================================================
  //  *
  //  * [Execution Block]
  //  * The following lines will be executed sequentially
  //  *
  //  * ========================================================================== */

  // activate();
})(window.jQuery, window._, window.Papa);
