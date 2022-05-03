const websites = [
  'facebook',
  'instagram',
  'twitter',
  'reddit',
  'youtube'
]

chrome.webRequest.onBeforeRequest.addListener(
  function (details) { console.log(details.url); return { cancel: true } },
  { urls: websites.map(w => `*://*.${w}.com/*`) },
  ['blocking']
)
