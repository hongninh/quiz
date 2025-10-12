/**
 * Global H5P Script
 * This file contains H5P initialization and common functionality that can be reused across pages
 */

// Initialize H5P Integration configuration
function initializeH5P(contentId, contentData) {
    // Create H5P Integration object
    window.H5PIntegration = {
        "ajax": {
            "setFinished": "",
            "contentUserData": ""
        },
        "ajaxPath": "/h5p/ajax?action=",
        "contents": {},
        "core": {
            "scripts": [
                "/h5p/core/js/jquery.js?version=1.24-master",
                "/h5p/core/js/h5p.js?version=1.24-master",
                "/h5p/core/js/h5p-event-dispatcher.js?version=1.24-master",
                "/h5p/core/js/h5p-x-api-event.js?version=1.24-master",
                "/h5p/core/js/h5p-x-api.js?version=1.24-master",
                "/h5p/core/js/h5p-content-type.js?version=1.24-master",
                "/h5p/core/js/h5p-confirmation-dialog.js?version=1.24-master",
                "/h5p/core/js/h5p-action-bar.js?version=1.24-master",
                "/h5p/core/js/request-queue.js?version=1.24-master"
            ],
            "styles": [
                "/h5p/core/styles/h5p.css?version=1.24-master",
                "/h5p/core/styles/h5p-confirmation-dialog.css?version=1.24-master",
                "/h5p/core/styles/h5p-core-button.css?version=1.24-master"
            ]
        },
        "l10n": {
            "H5P": {
                "fullscreen": "Fullscreen",
                "disableFullscreen": "Disable fullscreen",
                "download": "Download",
                "copyrights": "Rights of use",
                "embed": "Embed",
                "size": "Size",
                "showAdvanced": "Show advanced",
                "hideAdvanced": "Hide advanced",
                "advancedHelp": "Include this script on your website if you want dynamic sizing of the embedded content:",
                "copyrightInformation": "Rights of use",
                "close": "Close",
                "title": "Title",
                "author": "Author",
                "year": "Year",
                "source": "Source",
                "license": "License",
                "thumbnail": "Thumbnail",
                "noCopyrights": "No copyright information available for this content.",
                "reuse": "Reuse",
                "reuseContent": "Reuse Content",
                "reuseDescription": "Reuse this content.",
                "downloadDescription": "Download this content as a H5P file.",
                "copyrightsDescription": "View copyright information for this content.",
                "embedDescription": "View the embed code for this content.",
                "h5pDescription": "Visit H5P.org to check out more cool content.",
                "contentChanged": "This content has changed since you last used it.",
                "startingOver": "You'll be starting over.",
                "by": "by",
                "showMore": "Show more",
                "showLess": "Show less",
                "subLevel": "Sublevel",
                "confirmDialogHeader": "Confirm action",
                "confirmDialogBody": "Please confirm that you wish to proceed. This action is not reversible.",
                "cancelLabel": "Cancel",
                "confirmLabel": "Confirm",
                "licenseU": "Undisclosed",
                "licenseCCBY": "Attribution",
                "licenseCCBYSA": "Attribution-ShareAlike",
                "licenseCCBYND": "Attribution-NoDerivs",
                "licenseCCBYNC": "Attribution-NonCommercial",
                "licenseCCBYNCSA": "Attribution-NonCommercial-ShareAlike",
                "licenseCCBYNCND": "Attribution-NonCommercial-NoDerivs",
                "licenseCC40": "4.0 International",
                "licenseCC30": "3.0 Unported",
                "licenseCC25": "2.5 Generic",
                "licenseCC20": "2.0 Generic",
                "licenseCC10": "1.0 Generic",
                "licenseGPL": "General Public License",
                "licenseV3": "Version 3",
                "licenseV2": "Version 2",
                "licenseV1": "Version 1",
                "licensePD": "Public Domain",
                "licenseCC010": "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication",
                "licensePDM": "Public Domain Mark",
                "licenseC": "Copyright",
                "contentType": "Content Type",
                "licenseExtras": "License Extras",
                "changes": "Changelog",
                "contentCopied": "Content is copied to the clipboard",
                "connectionLost": "Connection lost. Results will be stored and sent when you regain connection.",
                "connectionReestablished": "Connection reestablished.",
                "resubmitScores": "Attempting to submit stored results.",
                "offlineDialogHeader": "Your connection to the server was lost",
                "offlineDialogBody": "We were unable to send information about your completion of this task. Please check your internet connection.",
                "offlineDialogRetryMessage": "Retrying in :num....",
                "offlineDialogRetryButtonLabel": "Retry now",
                "offlineSuccessfulSubmit": "Successfully submitted results."
            }
        }
    };

    // Add content-specific configuration
    H5PIntegration.contents[contentId] = contentData;
}

// Load H5P Core scripts dynamically
function loadH5PCore(callback) {
    const scripts = H5PIntegration.core.scripts;
    let loadedCount = 0;

    function loadScript(src, onLoad) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onLoad;
        script.onerror = function() {
            console.error('Failed to load script:', src);
            onLoad(); // Continue even if a script fails
        };
        document.head.appendChild(script);
    }

    function loadNextScript() {
        if (loadedCount < scripts.length) {
            loadScript(scripts[loadedCount], function() {
                loadedCount++;
                loadNextScript();
            });
        } else {
            if (callback) callback();
        }
    }

    loadNextScript();
}

// Load H5P Core styles
function loadH5PStyles() {
    H5PIntegration.core.styles.forEach(function(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Load content-specific scripts
function loadContentScripts(scripts, callback) {
    let loadedCount = 0;

    function loadScript(src, onLoad) {
        const script = document.createElement('script');
        script.src = src;
        script.onload = onLoad;
        script.onerror = function() {
            console.error('Failed to load script:', src);
            onLoad();
        };
        document.head.appendChild(script);
    }

    function loadNextScript() {
        if (loadedCount < scripts.length) {
            loadScript(scripts[loadedCount], function() {
                loadedCount++;
                loadNextScript();
            });
        } else {
            if (callback) callback();
        }
    }

    loadNextScript();
}

// Load content-specific styles
function loadContentStyles(styles) {
    styles.forEach(function(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Initialize H5P content on page load
function initializeH5PContent(contentId) {
    // Load styles first
    loadH5PStyles();
    
    const contentConfig = H5PIntegration.contents[contentId];
    if (contentConfig && contentConfig.styles) {
        loadContentStyles(contentConfig.styles);
    }

    // Load core scripts, then content scripts
    loadH5PCore(function() {
        if (contentConfig && contentConfig.scripts) {
            loadContentScripts(contentConfig.scripts, function() {
                console.log('H5P content initialized successfully');
            });
        }
    });
}
