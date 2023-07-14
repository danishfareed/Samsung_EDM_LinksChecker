chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'validateLinks') {
      var nonRelevantLinks = request.links;
      var addresses = Array.from(document.getElementsByTagName('address'));
      var addressContent = addresses.length > 0 ? addresses[0].textContent.trim() : '';
  
      validateLinkStatus(nonRelevantLinks).then(function(links) {
        sendResponse({ nonRelevantLinks: links, addressContent: addressContent });
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
  