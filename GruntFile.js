module.exports = function(grunt) {
  grunt.initConfig({
    jasmine: {
      src: ['src/toaster.js'],
      options: {
        specs: [
          'tests/spec/toast.js',
          'tests/spec/toaster.js'
        ],
        helpers: [
          'tests/spec/*helper.js'
          ],
        vendor: [
          'components/jquery/jquery.js'
        ]
      }
    },
    uglify: {
      my_target: {
        files: {
          'src/toaster.min.js': ['src/toaster.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['src/toaster.js'],
        tasks: ['uglify'],
        options: {
          nospawn: true
        }
      }
    }
  });


  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
