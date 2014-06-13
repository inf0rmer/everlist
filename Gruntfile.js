module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      options: {
        banner: '/**\n' +
              ' * <%= pkg.title %> v<%= pkg.version %>\n' +
              ' *\n' +
              ' * Copyright (c) <%= grunt.template.today("yyyy") %>' +
              '<%= pkg.author %>\n' +
              ' * Distributed under MIT License\n' +
              ' *\n' +
              ' * Documentation and full license available at:\n' +
              ' * <%= pkg.homepage %>\n' +
              ' *\n' +
              ' */\n',
        report: 'gzip'
      },
      browser: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    },

    watch: {
      files: '<%= jshint.files %>',
      tasks: ['default']
    },

    jshint: {
      files: ['Gruntfile.js', './src/*.js', './src/!(lib)**/*.js', 'spec/*.js', 'spec/!(lib)**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        jquery: true,
        globals: {
          console: false,
          expect: false,
          describe: false,
          before: false,
          beforeEach: false,
          afterEach: false,
          it: false,
          xit: false,
          setup: false,
          suite: false,
          teardown: false,
          test: false,
          jasmine: false,
          module: false,
          require: false,
          define: false,
          spyOn: false,
          requirejs: false,
          unescape: false
        }
      }
    },

    jasmine: {
      test: {
        src: ['./dist/everlist.js'],
        options: {
          specs: './spec/*Spec.js',
          vendor: ["./demo/js/lib/jquery.js"],
          template: require('grunt-template-jasmine-requirejs'),
          templateOptions: {
            requireConfig: {
              baseUrl: '.',
              paths: {
                "everlist": "./dist/everlist"
              }
            }
          }
        }
      }
    },

    browserify: {
      'dist/everlist.js': ['src/everlist.js'],
      options: {
        bundleOptions: {
          standalone: 'everlist'
        }
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('build', [
    'jshint',
    'browserify',
    'uglify'
  ]);
  grunt.registerTask('test', ['build', 'jasmine']);

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-rigger');
  grunt.loadNpmTasks('grunt-browserify');
};
