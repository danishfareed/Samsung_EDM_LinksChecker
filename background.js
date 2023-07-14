chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'validateLinks') {
      validateLinkStatus(request.links).then(function(links) {
        sendResponse({ nonRelevantLinks: links });
      });
      return true; // Keep the message channel open for asynchronous response
    }
  });
  
  /**
   * Function to validate link status
   * @param {array} links - Array of links to validate
   * @returns {Promise} - Resolves with the updated links array
   */
  function validateLinkStatus(links) {
    var promises = links.map(function(link) {
      return new Promise(function(resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', link.href);
        xhr.onload = function() {
          link.status = xhr.status;
          link.isRelevant = link.status === 200;
          resolve(link);
        };
        xhr.onerror = function() {
          link.status = xhr.status;
          link.isRelevant = false;
          resolve(link);
        };
        xhr.send();
      });
    });
  
    return Promise.all(promises);
  }
  