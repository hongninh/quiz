/**
 * Local H5P Script - Single Choice Set
 * This file contains page-specific content data and configuration
 */

// Content ID for this page
const CONTENT_ID = "cid-3523085989";

// Input data for Single Choice Set
const contentData = {
    "displayOptions": {
        "copy": false,
        "copyright": false,
        "embed": false,
        "export": false,
        "frame": false,
        "icon": false
    },
    "fullScreen": "0",
    "jsonContent": JSON.stringify({
        "choices": [
            {
                "subContentId": "0f4fd4c8-5a63-430a-83b0-e7407402a385",
                "question": "<p>Chọn tình huống nguy cơ</p>\n",
                "answers": [
                    "<p>a</p>\n",
                    "<p>b</p>\n",
                    "<p>c</p>\n"
                ]
            },
            {
                "subContentId": "dc080d0e-d293-488e-9fba-26c4bbf06377"
            }
        ],
        "overallFeedback": [
            {
                "from": 0,
                "to": 100
            }
        ],
        "behaviour": {
            "autoContinue": true,
            "timeoutCorrect": 2000,
            "timeoutWrong": 3000,
            "soundEffectsEnabled": true,
            "enableRetry": true,
            "enableSolutionsButton": true,
            "passPercentage": 100
        },
        "l10n": {
            "nextButtonLabel": "Next question",
            "showSolutionButtonLabel": "Show solution",
            "retryButtonLabel": "Retry",
            "solutionViewTitle": "Solution list",
            "correctText": "Correct!",
            "incorrectText": "Incorrect!",
            "shouldSelect": "Should have been selected",
            "shouldNotSelect": "Should not have been selected",
            "muteButtonLabel": "Mute feedback sound",
            "closeButtonLabel": "Close",
            "slideOfTotal": "Slide :num of :total",
            "scoreBarLabel": "You got :num out of :total points",
            "solutionListQuestionNumber": "Question :num",
            "a11yShowSolution": "Show the solution. The task will be marked with its correct solution.",
            "a11yRetry": "Retry the task. Reset all responses and start the task over again."
        }
    }),
    "library": "H5P.SingleChoiceSet 1.11",
    "contentUrl": ".",
    "metadata": {
        "license": "U",
        "title": "Chọn tình huống",
        "defaultLanguage": "en"
    },
    "scripts": [
        "/h5p/libraries/H5P.Transition-1.0/transition.js?version=1.0.4",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-help-dialog.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-message-dialog.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progress-circle.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-simple-rounded-button.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-speech-bubble.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-throbber.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-tip.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-slider.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-score-bar.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-progressbar.js?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/js/joubel-ui.js?version=1.3.19",
        "/h5p/libraries/H5P.Question-1.5/scripts/question.js?version=1.5.15",
        "/h5p/libraries/H5P.Question-1.5/scripts/explainer.js?version=1.5.15",
        "/h5p/libraries/H5P.Question-1.5/scripts/score-points.js?version=1.5.15",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/stop-watch.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/sound-effects.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/xapi-event-builder.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/result-slide.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/solution-view.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/single-choice-alternative.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/single-choice.js?version=1.11.44",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/scripts/single-choice-set.js?version=1.11.44"
    ],
    "styles": [
        "/h5p/libraries/FontAwesome-4.5/h5p-font-awesome.min.css?version=4.5.4",
        "/h5p/libraries/H5P.FontIcons-1.0/styles/h5p-font-icons.css?version=1.0.6",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-help-dialog.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-message-dialog.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progress-circle.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-simple-rounded-button.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-speech-bubble.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-tip.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-slider.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-score-bar.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-progressbar.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-ui.css?version=1.3.19",
        "/h5p/libraries/H5P.JoubelUI-1.3/css/joubel-icon.css?version=1.3.19",
        "/h5p/libraries/H5P.Question-1.5/styles/question.css?version=1.5.15",
        "/h5p/libraries/H5P.Question-1.5/styles/explainer.css?version=1.5.15",
        "/h5p/libraries/H5P.SingleChoiceSet-1.11/styles/single-choice-set.css?version=1.11.44"
    ],
    "url": ".",
    "exportUrl": "/h5p/download/3523085989"
};

// Initialize H5P when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize H5P with content data
    initializeH5P(CONTENT_ID, contentData);
    
    // Initialize H5P content rendering
    initializeH5PContent(CONTENT_ID);
});
