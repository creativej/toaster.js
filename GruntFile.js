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
    }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('default', 'jasmine');
};
