// DEV. EXTENTION BY iTON // => BACKGROUND.JS
// NOTE:    Click to Shorten URL
// UPDATE:  13/06/2018  - Copy Add-On from SHT-FF ver. 1.3.1
//                      - Edit and Optimize for Opera Add-On.
//          14/06/2018  - Optimize update and Bug fixed.
//          26/11/2018  - Update API and Changed URL Link.
//          16/05/2020  - Update API with Firebase and Changed Domain Link.

// API

let TAB_URL = '';
let TITLE = '';

chrome.runtime.onMessage.addListener(function (request) {
  let resultX = request;
  if (resultX.script === "shortenLink") {
    shortenLink(resultX.tab_url, resultX.title);
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https', 'http'] }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function onError(error) {
  console.log(`Error: ${error}`);
}

function shortenLink(link, title) {
  const longDynamicLink = link;
  const urlKey = "https://us-central1-url-shortener-x.cloudfunctions.net/getKey";

  fetch(urlKey)
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }

        // Examine the text in the response
        response.json().then(function (data) {
          console.log(data);
          const api = data;
          fetch(api.key, {
            method: 'post',
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
              "dynamicLinkInfo": {
                "dynamicLinkDomain": api.domain,
                "link": longDynamicLink
              },
              "suffix": {
                "option": "SHORT"
              }
            })
          })
            // .then(json)
            .then(function (response) {
              console.log('Request succeeded with JSON response', response);
              response.json().then(function(data) {
                chrome.runtime.sendMessage({ shortLink: data.shortLink, title: title, longLink: link });
                });
            })
            .catch(function (error) {
              console.log('Request failed', error);
            });
        });
      }
    )
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });

}


