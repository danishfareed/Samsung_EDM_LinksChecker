chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {


    if (request.market) {
      var relevantURLs = {
        SESAR: [
            'https://samsung.com/sa_en/', 
            'https://samsung.com/sa/',
            'https://mena.samsung.com/sa_en/',
            'https://mena.samsung.com/sa/',
            'https://facebook.com/SamsungSaudi/',
            'https://twitter.com/SamsungSaudi',
            'https://facebook.com/SamsungSaudi/',
            'https://youtube.com/theSamsungSaudi',
            'https://instagram.com/samsungsaudi/',
            'https://instagram.com/samsungsaudi/',
            'https://samsung-crm.com/mena/unsubscribe/KSA/En/optout.html'
        ],
        SEPAK: [
            'https://samsung.com/pk/',
            'https://mena.samsung.com/pk/',
            'https://facebook.com/samsungpakistan/',
            'https://twitter.com/samsung_pak',
            'https://youtube.com/user/SamsungPakistan/',
            'https://instagram.com/samsungpakistan/',
            'https://samsung-crm.com/mena/unsubscribe/sepak/En/optout.html'
        ],
        SEIL: [
            'https://samsung.com/il/',
            'https://mena.samsung.com/il/',
            'https://facebook.com/Samsung.Israel/',
            'https://youtube.com/user/SamsungIsrael',
            'https://instagram.com/samsungisrael',
            'https://vm.tiktok.com/ZSeXftYsp/',
            'https://twitter.com/SamsungIsrael/',
            'https://samsung-crm.com/mena/unsubscribe/SEIL/he/optout.html',
            'http://samsung.com/il/info/legal/',
            'http://samsung.com/il/info/privacy/',
            'http://samsung.com/il/info/contactus/',
            'mailto: crm_il@samsung.com'
        ],
        SEEG: [
            'https://samsung.com/eg/',
            'https://mena.samsung.com/eg/',
            'https://facebook.com/SamsungEgypt/',
            'https://twitter.com/SamsungEgypt/',
            'https://youtube.com/user/SamsungEgypt/',
            'https://instagram.com/samsungegypt/',
            'https://samsung-crm.com/mena/unsubscribe/seeg/ar/optout.html'
        ],
        SEMAG: [
            'https://samsung.com/n_africa/',
            'https://mena.samsung.com/n_africa/',
            'https://facebook.com/SamsungMaroc',
            'https://twitter.com/SamsungMaroc',
            'https://youtube.com/user/SamsungMorocco',
            'https://instagram.com/samsungmaroc/',
            'https://facebook.com/SamsungMaroc',
            'https://samsung-crm.com/mena/unsubscribe/semag/fr/optout.html'
        ],
        JORDAN: [
            'https://samsung.com/levant/',
            'https://samsung.com/levant_ar/',
            'https://mena.samsung.com/levant/',
            'https://mena.samsung.com/levant_ar/',
            'https://facebook.com/SamsungJordan/',
            'https://twitter.com/SamsungLEVANT',
            'https://youtube.com/user/SamsungLEVANT',
            'https://instagram.com/samsunglevant/',
            'https://samsung-crm.com/mena/unsubscribe/selv/Ar/jordan/optout.html'
        ],
        LEBANON: [
            'https://samsung.com/lb/',
            'https://mena.samsung.com/il/',
            'https://facebook.com/SamsungLebanon/',
            'https://twitter.com/SamsungLEVANT',
            'https://twitter.com/SamsungLEVANT',
            'https://youtube.com/user/SamsungLEVANT',
            'https://instagram.com/samsunglevant/',
            'https://samsung-crm.com/mena/unsubscribe/selv/En/lebanon/optout.html',
            'http://samsung.com/lb/info/legal/',
            'http://samsung.com/lb/info/privacy/',
            'http://samsung.com/lb/info/contactus/',
            'https://samsung.com/lb/info/legal/',
            'https://samsung.com/lb/info/privacy/',
            'https://samsung.com/lb/info/contactus/'
        ],
        IRAQ: [
            'https://samsung.com/iq_ar/',
            'https://mena.samsung.com/iq_ar/',
            'https://facebook.com/SamsungIraq/',
            'https://twitter.com/SamsungLEVANT',
            'https://youtube.com/user/SamsungLEVANT',
            'https://instagram.com/samsunglevant/',
            'https://samsung.com/iq_ar/info/legal/',
            'https://samsung.com/iq_ar/privacy-policy/',
            'https://samsung.com/iq_ar/info/contactus/',
            'https://samsung-crm.com/mena/unsubscribe/selv/Ar/iraq/optout.html'
          ],
          TURKEY: [
            'https://www.samsung.com/tr/',
            'https://samsung.com/tr/',
            'https://samsung.com/tr/info/legal/',
            'https://samsung.com/tr/privacy-policy/',
            'https://samsung.com/tr/info/contactus/',
            ]
      };

      var links = document.getElementsByTagName('a');
      var nonRelevantLinks = [];

      for (var i = 0; i < links.length; i++) {
        var link = links[i].href.replace(/(https?:\/\/)?(www\.)/, '$1');
        var isRelevant = relevantURLs[request.market].some(function(url) {
          return link.startsWith(url);
        });

        if (!isRelevant) {
          nonRelevantLinks.push(link);
        }
      }

      var addresses = document.getElementsByTagName('address');
      console.log("address: "+addresses);
        if (addresses.length > 0) {
            console.log("address: "+addresses);
            addressContent = addresses[0].textContent.trim();
        }else{
            addressContent = 0;
        }

    sendResponse({ nonRelevantLinks: nonRelevantLinks, addressContent: addressContent });

    }
  });

  /**tooltip code starts */

  let enableInspect = false;

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.enableInspect !== undefined) {
    enableInspect = message.enableInspect;
    if (enableInspect) {
      attachEventListeners();
    } else {
      removeEventListeners();
    }
  }
});

function attachEventListeners() {
  document.addEventListener('mouseover', showAttributesTooltip);
  document.addEventListener('mouseout', hideAttributesTooltip);
}

function removeEventListeners() {
  document.removeEventListener('mouseover', showAttributesTooltip);
  document.removeEventListener('mouseout', hideAttributesTooltip);
}

function showAttributesTooltip(event) {
  if (!enableInspect) return;

  const target = event.target;
  const attributes = Array.from(target.attributes);

  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.id = 'linkTooltip';
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${event.clientY + 10}px`;
    tooltip.style.left = `${event.clientX + 10}px`;
    tooltip.style.backgroundColor = '#f9f9f9';
    tooltip.style.color = '#000001';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '5px';
    tooltip.style.zIndex = '9999';

  for (const attribute of attributes) {
    const attributeElement = document.createElement('div');
    attributeElement.textContent = `${attribute.name}: ${attribute.value}`;
    tooltip.appendChild(attributeElement);
  }

  tooltip.style.top = event.clientY + 'px';
  tooltip.style.left = event.clientX + 'px';

  document.body.appendChild(tooltip);
}

function hideAttributesTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.remove();
  }
}