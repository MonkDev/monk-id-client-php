'use strict';

module.exports = function(grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  var optionIncrement = grunt.option('increment');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
      bin: 'vendor/bin',
      lib: 'lib/**/*.php',
      tests: 'tests/**/*.php'
    },
    bump: {
      options: {
        commitFiles: ['-a'],
        files: ['package.json'],
        updateConfigs: ['pkg']
      }
    },
    'gh-pages': {
      options: {
        base: 'doc',
        message: 'Latest auto-generated docs. [ci skip]'
      },
      src: '**/*'
    },
    jshint: {
      gruntfile: {
        files: {
          src: 'Gruntfile.js'
        },
        options: {
          jshintrc: true
        }
      }
    },
    phpcpd: {
      lib: {
        dir: '<%= paths.lib %>'
      },
      options: {
        bin: '<%= paths.bin %>/phpcpd'
      }
    },
    phpcs: {
      lib: {
        dir: [
          '<%= paths.lib %>',
          '<%= paths.tests %>'
        ]
      },
      options: {
        bin: '<%= paths.bin %>/phpcs',
        standard: 'PSR2'
      }
    },
    phplint: {
      src: [
        '<%= paths.lib %>',
        '<%= paths.tests %>'
      ]
    },
    phpmd: {
      lib: {
        dir: 'lib'
      },
      options: {
        bin: '<%= paths.bin %>/phpmd',
        reportFormat: 'text',
        rulesets: ['codesize', 'controversial', 'design', 'naming', 'unusedcode'].join(',')
      }
    },
    phpunit: {
      classes: {
        dir: 'tests/lib'
      },
      options: {
        bin: '<%= paths.bin %>/phpunit'
      }
    },
    prompt: {
      deploy: {
        options: {
          questions: [
            {
              config: 'deploy.increment',
              type: 'list',
              message: 'Which part of the version number do you want to increment? (Current: v<%= pkg.version %>)',
              choices: [
                {
                  value: 'build',
                  name: 'build (x.y.z-N) -- append build number for pre-release'
                },
                {
                  value: 'git',
                  name: 'git (x.y.z-NNNNN) -- append git revision for pre-release'
                },
                {
                  value: 'patch',
                  name: 'patch (x.y.Z) -- backwards-compatible bug fixes'
                },
                {
                  value: 'minor',
                  name: 'minor (x.Y.z) -- added functionality in a backwards-compatible manner'
                },
                {
                  value: 'major',
                  name: 'major (X.y.z) -- incompatible API changes'
                }
              ],
              when: function() {
                return !optionIncrement;
              }
            }
          ]
        }
      }
    },
    shell: {
      options: {
        stdout: true
      },
      phpdcd: {
        command: '<%= paths.bin %>/phpdcd <%= paths.lib %>'
      },
      phpdoc: {
        command: '<%= paths.bin %>/phpdoc'
      },
      phploc: {
        command: '<%= paths.bin %>/phploc <%= paths.lib %>'
      },
      'security-checker': {
        command: '<%= paths.bin %>/security-checker security:check'
      }
    },
    watch: {
      jshint: {
        files: '<%= jshint.gruntfile.files.src %>',
        tasks: 'jshint:gruntfile'
      },
      phpcpd: {
        files: '<%= phpcpd.lib.dir %>',
        tasks: 'phpcpd'
      },
      phpcs: {
        files: '<%= phpcs.lib.dir %>',
        tasks: 'phpcs'
      },
      phplint: {
        files: '<%= phplint.src %>',
        tasks: 'phplint'
      },
      phpunit: {
        files: [
          '<%= phpunit.classes.dir %>/**/*.php',
          '<%= phpcs.lib.dir %>'
        ],
        tasks: 'phpunit'
      },
      'security-checker': {
        files: 'composer.json',
        tasks: 'security-checker'
      }
    }
  });

  grunt.registerTask('bump-increment', 'Increment the version number.', function(inc) {
    var increment = inc || optionIncrement || grunt.config('deploy.increment');

    grunt.task.run('bump:' + increment + ':bump-only');
  });

  grunt.registerTask('phpdcd', ['shell:phpdcd']);
  grunt.registerTask('phpdoc', ['shell:phpdoc']);
  grunt.registerTask('phploc', ['shell:phploc']);
  grunt.registerTask('security-checker', ['shell:security-checker']);

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('test', ['phpunit']);
  grunt.registerTask('quality', ['phplint', 'phpcs', 'phpcpd', 'phploc', 'phpdcd', 'phpmd', 'security-checker']);
  grunt.registerTask('build', ['jshint', 'test', 'quality', 'phpdoc']);
  grunt.registerTask('deploy', ['prompt:deploy', 'bump-increment', 'build', 'bump::commit-only', 'gh-pages']);
};
