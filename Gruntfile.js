'use strict';
module.exports = function (grunt) {
    //noinspection JSUnresolvedFunction
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                nonew: true,
                curly: true,
                noarg: true,
                forin: true,
                noempty: true,
                node: true,
                eqeqeq: true,
                strict: true,
                undef: true,
                bitwise: true,
                browser: true
            },
            '<%=pkg.name%>': {
                src: ['src/*.js']
            }
        },
        concat: {
            dist: {
                src: ['src/JSRutils.js', 'src/Utils.js', 'src/Numeral.js', 'src/Dt.js'],
                dest: 'build/<%=pkg.name%>-<%=pkg.version%>.js'
            }
        },
        uglify: {
            options: {
                banner: '/* <%=pkg.name%> -v<%=pkg.version%> - <%=grunt.template.today("dd-mm-yyyy")%> */\n'
            },
            build: {
                src: 'build/<%=pkg.name%>-<%=pkg.version%>.js',
                dest: 'build/<%=pkg.name%>.min.js'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/UtilsTest.js', 'test/NumeralTest.js', 'test/DtTest.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'mochaTest']);
};
