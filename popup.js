document.addEventListener('DOMContentLoaded', function() {
    var checkButton = document.getElementById('checkLinks');
    checkButton.addEventListener('click', function() {
      var selectedMarket = document.querySelector('input[name="market"]:checked').value;
      checkLinks(selectedMarket);
    });
  });
  
  function checkLinks(market) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.executeScript(tab.id, { file: 'content.js' }, function() {
        chrome.tabs.sendMessage(tab.id, { market: market }, function(response) {
          displayResults(response.nonRelevantLinks, response.addressContent);
          applyTypingAnimation();
        });
      });
    });
  }
  
  function displayResults(nonRelevantLinks, addressContent) {
    var resultsDiv = document.getElementById('results');

    
    address = '<div class="address-container"><h4>Address in EDM:</h4><p>' + addressContent + '</p></div>';
    if (nonRelevantLinks.length > 0) {
        var linksHTML = '<span styly="font-weight: bold;">Non Relevant Links:</span><br>';
         linksHTML += nonRelevantLinks.map(function(link, index) {
            link = link.replace(/(https?:\/\/)?(www\.)/, '$1');
            return '<div class="result-link"><span class="link-number">' + (index + 1) + '.</span> <a class="typing-animation" href="' + link + '">' + link + '</a></div>';
          }).join('');
    
          resultsDiv.innerHTML = linksHTML + address;
        } else {
          resultsDiv.innerHTML = address;
        }
      

  }
  
  
  function applyTypingAnimation() {
    var links = document.querySelectorAll('#results a');
    links.forEach(function(link) {
      link.classList.add('typing-animation');
    });
  }
  