document.addEventListener('DOMContentLoaded', function() {
    var checkButton = document.getElementById('checkLinks');
    checkButton.addEventListener('click', function() {
      var selectedMarket = document.querySelector('input[name="market"]:checked');
      if (selectedMarket) {
        selectedMarket = selectedMarket.value;
        checkLinks(selectedMarket);
      } else {
        displayMessage('Select a market first!');
      }
    });
  });
  
  /**
   * Function to display a message in the results div
   * @param {string} message - The message to display
   */
  function displayMessage(message) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p class="message">' + message + '</p>';
  }
  
  
  /**
   * Function to initiate link checking process
   * @param {string} market - Selected market value
   */
  function checkLinks(market) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.executeScript(tab.id, { file: 'content.js' }, function() {
        chrome.tabs.sendMessage(tab.id, { market: market }, function(response) {
          validateLinkStatus(response.nonRelevantLinks);
          displayResults(response.nonRelevantLinks, response.addressContent);
          applyTypingAnimation();
        });
      });
    });
  }
  
  /**
   * Function to validate link status
   * @param {array} links - Array of links to validate
   */
  function validateLinkStatus(links) {
    links.forEach(function(link) {
      var xhr = new XMLHttpRequest();
      xhr.open('HEAD', link.href);
      xhr.onload = function() {
        link.status = xhr.status;
        if (link.status !== 200) {
          link.isRelevant = false;
        }
      };
      xhr.onerror = function() {
        link.status = xhr.status;
        link.isRelevant = false;
      };
      xhr.send();
    });
  }
  
 /**
 * Function to display the results in the popup
 * @param {array} nonRelevantLinks - Array of non-relevant links
 * @param {string} addressContent - Content within the address tag
 */
function displayResults(nonRelevantLinks, addressContent) {
    var resultsDiv = document.getElementById('results');
  
    var address = '<div class="address-container"><h4>Address in EDM:</h4><p>' + addressContent + '</p></div>';
    if (nonRelevantLinks.length > 0) {
      var linksHTML = '<span style="font-weight: bold;">Non Relevant Links:</span><br>';
      linksHTML += nonRelevantLinks
        .filter(function(link) {
          return !link.isRelevant;
        })
        .map(function(link, index) {
          var linkColor = link.isRelevant ? '#fffffe' : '#fffffe';
          var linkStatus = link.status ? '(' + link.status + ')' : ''; // Check if status exists
          return (
            '<div class="result-link"><span class="link-number">' +
            (index + 1) +
            '.</span> <a class="typing-animation" href="' +
            link.href +
            '" style="color: ' +
            linkColor +
            ';">' +
            link.href +
            '</a> ' +
            linkStatus + // Include the link status
            '</div>'
          );
        })
        .join('');
  
      resultsDiv.innerHTML = linksHTML + address;
    } else {
      resultsDiv.innerHTML = address;
    }
  }
  
  
  /**
   * Function to apply typing animation to the links
   */
  function applyTypingAnimation() {
    var links = document.querySelectorAll('#results a');
    links.forEach(function(link) {
      link.classList.add('typing-animation');
    });
  }
  