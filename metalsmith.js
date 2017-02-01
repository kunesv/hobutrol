var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var dateFormatter = require('metalsmith-date-formatter');
var layouts = require('metalsmith-layouts');
var sass = require('metalsmith-sass');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var dateInFilename = require('metalsmith-date-in-filename');
var inspect = require('metalsmith-inspect');
var title = require('metalsmith-title');
var keymaster = require('metalsmith-keymaster');
var markdownRemarkable = require('metalsmith-markdown-remarkable');

Metalsmith(__dirname)
    .source('./src')
    .destination('./build')
    .clean(true)
    .use(dateInFilename(false))
    .use(markdownRemarkable('full'))
    .use(title())
    .use(keymaster({
        from: function (data) {
            return data.title ? data.title.split(',')[0] : '';
        },
        to: 'shortTitle'
    }))
    .use(collections({
        // "meetingRecordsLatest": {
        //     pattern: 'zapisy/schuze/**/*.*',
        //     sortBy: 'date',
        //     reverse: true,
        //     limit: 4
        // },
        "meetingRecords": {
            pattern: 'zapisy/schuze/**/*.html',
            sortBy: 'date'
        },
        "boardRecords": {
            pattern: 'zapisy/spravni_rada/**/*.html',
            sortBy: 'date'
        }
    }))
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
        engine: 'handlebars',
        default: 'zapis.html',
        pattern: "**/*.html"
    }))
    .use(sass({
        outputDir: 'css/'
    }))
    .use(inspect())
    .use(serve({
        host: '0.0.0.0',
        port: process.env.PORT || 5000
    }))
    .use(watch(
        {
            paths: {
                "${source}/**/*": "**/*", // every changed files will trigger a rebuild of themselves
                "layouts/**/*": "**/*", // every templates changed will trigger a rebuild of all files
                "${source}/scss/**/*": "**/*" // every sass changed will trigger a rebuild of all files
            }
        }
    ))
    .build(function (err) {
        if (err) throw err;
    });


