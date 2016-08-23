(function($, _, Handlebars, Papa, tkDataStore) {
  'use strict';

  $(function() {

    /* =========================================================================
     * [Event Her Registrations]
     * ====================================================================== */

    function activate() {
      _registerLoadQuestionModuleHandler();
      _registerChooseAnswerHandler();
      _registerMakeDecisionHandler();
    }

    function _registerLoadQuestionModuleHandler() {
      $('.js-load-question-module').on('click', function(event) {
        var $this = $(this);
        _loadQuestionModule($this.data('module'));
      });
    }

    function _registerChooseAnswerHandler() {
      $('#tk-millionarie-class').on('click', '.js-choose-answer', function(event) {
        var $this = $(this);
        var selectedAnswer = $this.data('option');
        var correctAnswer = $this.data('answer');

        if (selectedAnswer === correctAnswer) {
          $this.addClass('is-selected is-true');
        } else {
          $this.addClass('is-selected is-false');
        }
      });
    }

    function _registerMakeDecisionHandler() {
      $('#tk-millionarie-class').on('click', '.js-decision-option', function(event) {
        var $this = $(this);
        var $title = $this.closest('.js-question-set').find('.js-decision-title');
        var $questionItem = $($this.data('question-item'));
        var decision = $this.data('decision');
        var optionText = $this.data('option') || tkDataStore.decisionText[decision];

        $title.text(optionText);
        $this.siblings('.js-decision-option').hide();
        $questionItem.addClass('disabled');
      });
    }

    /* =========================================================================
     * [Event Her Functions]
     * ====================================================================== */

    function _loadQuestionModule(moduleName) {
      return _buildModule(moduleName)
        .then(function() {
          window.location.href = window.location.origin + window.location.pathname + '#/slide-ready';
        })
        .fail(function() {
          window.location.href = window.location.origin + window.location.pathname;
          console.warn('Fail loading question module <' + moduleName + '> , please try another one');
        });
    }

    /* =========================================================================
     * [Privatections]
     * ====================================================================== */

    function _buildModule(moduleName) {
      return _fetchQuestionModule(moduleName)
        .then(_parseQuestionModule)
        .then(_compileQuestionsSlides);
    }

    function _fetchQuestionModule(moduleName) {
      return $.ajax({
        url: tkDataStore.csvSource.local[moduleName],
        type: 'GET',
      })
      .then(function(csvString) {
        return {
          name: moduleName,
          csv: csvString,
        };
      })
      .fail(function() {
        console.warn('Fail loading question module <' + moduleName + '> , please try another one');
      });
    }

    function _parseQuestionModule(module) {
      tkDataStore.questionModules[module.name] = Papa.parse(module.csv, {header: true}).data;
      return {
        name: module.name,
        questions: tkDataStore.questionModules[module.name]
      };
    }

    function _compileQuestionsSlides(module) {
      var moduleTemplateName = 'module' + _.capitalize(module.name);
      var slides = _compileTemplate(moduleTemplateName, {questions: module.questions});
      $('.reveal .slides .js-question-set').remove();
      $('#slide-index').after(slides);
    }

    function _compileTemplate(templateName, model) {
      return Handlebars.compile(tkDataStore.templateSources[templateName].template)(model);
    }

    activate();
  });
})(window.jQuery, window._, window.Handlebars, window.Papa, window.tkDataStore);
