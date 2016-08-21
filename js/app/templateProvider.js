(function($, _, Handlebars) {
  'use strict';

  $(function() {
    var tkDataStore = window.tkDataStore = window.tkDataStore || {};

    tkDataStore.templateSources = {
      slideReady: {id: 'slideReady', path: 'templates/slide-ready.hbs', template: '', partial: true},
      qcac: {id: 'qcac', path: 'templates/qcac.hbs', template: '', partial: false},
      qiac: {id: 'qiac', path: 'templates/qiac.hbs', template: '', partial: false},
      qvac: {id: 'qvac', path: 'templates/qvac.hbs', template: '', partial: false},
      qaac: {id: 'qaac', path: 'templates/qaac.hbs', template: '', partial: false},
      qcai: {id: 'qcai', path: 'templates/qcai.hbs', template: '', partial: false},
      qcan: {id: 'qcan', path: 'templates/qcan.hbs', template: '', partial: false},
      qian: {id: 'qian', path: 'templates/qian.hbs', template: '', partial: false},
      qvan: {id: 'qvan', path: 'templates/qvan.hbs', template: '', partial: false},
      qaan: {id: 'qaan', path: 'templates/qaan.hbs', template: '', partial: false}
    };

    /**
     * [Prefatch template string and register partials]
     */
    _.forEach(tkDataStore.templateSources, function(source) {
      $.get(source.path)
        .then(function(template) {
          // source.template = Handlebars.compile(template);
          source.template = template;
          return source;
        })
        .then(function(source) {
          if (source.partial) Handlebars.registerPartial(source.id, source.template);
        })
        .fail(function(err) {
          console.warn('Fail loading template <' + source.id + '> , please check whether the template file exist');
        });
    });

  });

})(window.jQuery, window._, window.Handlebars);