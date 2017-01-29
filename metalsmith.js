var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var markdown = require('metalsmith-markdown');
var permalinks = require('metalsmith-permalinks');
var dateFormatter = require('metalsmith-date-formatter');
var layouts = require('metalsmith-layouts');
var sass = require('metalsmith-sass');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');

Metalsmith(__dirname)
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(collections({
        // "meetingRecordsLatest": {
        //     pattern: 'zapisy/schuze/**/*.*',
        //     sortBy: 'date',
        //     reverse: true,
        //     limit: 4
        // },
        "meetingRecords": {
            pattern: 'zapisy/schuze/**/*.md',
            sortBy: 'date'
        },
        "boardRecords": {
            pattern: 'zapisy/spravni_rada/**/*.md',
            sortBy: 'date'
        }
    }))
    .use(markdown())
    .use(permalinks(
        {
            pattern: ':path:date',
            relative: false
        }
    ))
    .use(dateFormatter({
        dates: [{
            key: 'date',
            format: 'D. M. YYYY'
        }]
    }))
    .use(layouts({
        engine: 'handlebars'
    }))
    .use(sass({
        outputDir: 'css/'
    }))
    .use(serve({
        host: '0.0.0.0',
        port: process.env.PORT || 5000
    }))
    .use(watch(
        {
            paths: {
                "${source}/**/*": true, // every changed files will trigger a rebuild of themselves
                "layouts/**/*": "**/*", // every templates changed will trigger a rebuild of all files
                "${source}/scss/**/*": "**/*" // every sass changed will trigger a rebuild of all files
            }
        }
    ))
    .build(function (err) {
        if (err) throw err;
    });


