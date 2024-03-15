// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	// Check if the message is to get the tab URL
	if (message.message === "getTabUrl") {
		// Get the active tab URL
		chrome.tabs.query(
			{ active: true, currentWindow: true },
			function (tabs) {
				const tab = tabs[0];
				sendResponse({ tabUrl: tab.url });
			}
		);
		// Return true to indicate that the response will be sent asynchronously
		return true;
	}
});
