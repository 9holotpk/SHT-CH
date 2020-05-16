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

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { schemes: ['https', 'http'] }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
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

  function reqListener() {
    const api = JSON.parse(this.responseText);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", api.key, true);

    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = (JSON.parse(xhr.responseText));
        chrome.runtime.sendMessage({ shortLink: response.shortLink, title: title, longLink: link });
      }
    };

    // xhr.send(JSON.stringify({ "longUrl": link }));
    xhr.send(JSON.stringify({
      "dynamicLinkInfo": {
        "dynamicLinkDomain": api.domain,
        "link": longDynamicLink
      },
      "suffix": {
        "option": "SHORT"
      }
    }));
  }

  const oReq = new XMLHttpRequest();
  oReq.addEventListener("load", reqListener);
  oReq.open("GET", urlKey);
  oReq.send();

}


