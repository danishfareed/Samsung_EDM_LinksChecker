document.addEventListener('DOMContentLoaded', function() {
    var checkButton = document.getElementById('checkLinks');
    checkButton.addEventListener('click', function() {
      var selectedMarket = document.querySelector('input[name="market"]:checked').value;
      if (selectedMarket) {
        checkLinks(selectedMarket);
      } else {
        displayMessage('Select a market first!');
      }
      checkEverestTag();
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
  
  function checkEverestTag() {
    // Function to perform link checking
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      chrome.tabs.executeScript(tab.id, { code: "document.documentElement.outerHTML" }, function(result) {
        var htmlContent = result[0];
        // Call the regex function to extract links
        var extractedEverestTags = extractEverestTags(htmlContent);
        // Example: Display the extracted links
        console.log({extractedEverestTags});
        document.getElementById("results").innerHTML = 'Everest Tags Found:'+ extractedEverestTags.join('\n');
      });
    });
  }
  
  function extractEverestTags(htmlContent) {
    var regex = /(?:url\s*\(\s*['"]?([^'"\)]*everestengagement\.com[^'"\)]*)['"]?\s*\)|src=['"]([^'"\)]*everestengagement\.com[^'"\)]*)['"]|href=['"]([^'"\)]*everestengagement\.com[^'"\)]*)['"])/g;
    var extractedEverestTags = [];
    var match;
    while ((match = regex.exec(htmlContent))) {
      extractedEverestTags.push(match[1]);
    }
    return extractedEverestTags;
  }
  
  function displayMessage(message) {
    // Function to display a message in the popup or console
    console.log(message); // Example: Log the message to the console
  }


  function displayResults(nonRelevantLinks, addressContent) {
    var resultsDiv = document.getElementById('results');
  
    var address = addressContent
      ? '<div class="address-container"><h4>Address in EDM:</h4><p>' + addressContent + '</p></div>'
      : '<div class="address-container"><h4>Address not available</h4></div>';
  console.log(nonRelevantLinks)
    if (nonRelevantLinks.length > 0) {
      var linksHTML = '<span style="font-weight: bold;">Non Relevant Links:</span><br>';
      linksHTML += nonRelevantLinks
        .map(function(link, index) {
          var linkURL = link.replace(/(https?:\/\/)?(www\.)/, '$1');
          return (
            '<div class="result-link"><span class="link-number">' +
            (index + 1) +
            '.</span> <a class="typing-animation" href="' +
            linkURL +
            '">' +
            linkURL +
            '</a></div>'
          );
        })
        .join('');
  
      resultsDiv.innerHTML += linksHTML + address;
    } else {
      resultsDiv.innerHTML += address;
    }
  }
  
  function displayMessage(message) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p class="message">' + message + '</p>';
  }
 
  function applyTypingAnimation() {
    var links = document.querySelectorAll('#results a');
    links.forEach(function(link) {
      link.classList.add('typing-animation');
    });
  }
      // Function to extract links containing "everestengagement.com" using regex
function extractLinks(htmlContent) {
    const regex = /(?:href|src|url)=['"]([^'"]*everestengagement\.com[^'"]*)['"]/g;
  
    const extractedLinks = [];
    
    let match;
    while ((match = regex.exec(htmlContent))) {
      extractedLinks.push(match[1]);
    }
  
    return extractedLinks;
  }
  
  // Function to handle tab update
  function handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete" && tab.active) {
      chrome.tabs.executeScript(tabId, { code: "document.documentElement.innerHTML" }, function (result) {
        const htmlContent = result[0];
  
        // Call the regex function to extract links
        const extractedLinks = extractLinks(htmlContent);
        console.log(extractedLinks); // Array of extracted links
      });
    }
  }
  
  // Add tab update listener
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
