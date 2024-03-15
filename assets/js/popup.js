document.addEventListener("DOMContentLoaded", () => {
	let popupBody = document.querySelector(".body");
	const actionReload = document.getElementById("actionReload");

	actionReload.addEventListener("click", function () {
		fetchAssets();
	});

	popupBody.addEventListener("click", function (e) {
		if (e.target.dataset.sqspClipboard) {
			const url = e.target.dataset.sqspClipboard;
			navigator.clipboard.writeText(url);
			e.target.classList.add("copied");
			setTimeout(function () {
				e.target.classList.remove("copied");
			}, 1000);
		}
	});

	chrome.runtime.sendMessage({ message: "getTabUrl" }, function (response) {
		if (response && response.tabUrl) {
			if (response.tabUrl.includes("/config/asset-library")) {
				fetchAssets();
			} else {
				popupBody.innerHTML = `<div class="wrong-place"><img src="assets/404.svg"/><div class="big">You are in wrong place.</div><div>This doesn't look like Squarespace Assets Library.</div></div>`;
			}
		} else {
			popupBody.innerHTML = `<div class="loader"></div>`;
		}
	});

	chrome.runtime.onMessage.addListener(function (
		message,
		sender,
		sendResponse
	) {
		if (message.sqspAssets) {
			popupBody.innerHTML = getMarkup(message.sqspAssets);
			actionReload.style.visibility = "visible";
		}
	});
});

function fetchAssets() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			files: ["assets/js/content.js"],
		});
	});
}

function getMarkup(payload) {
	let markup;
	let copyIcon = `<svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 pointer-events-none"><path d="M13.2 4.096a3.743 3.743 0 015.148-.137l.144.137 1.412 1.412a3.743 3.743 0 01.137 5.148l-.137.144-4.023 4.023a3.743 3.743 0 01-5.148.137l-.144-.137-.706-.706a.749.749 0 01.982-1.125l.076.067.706.705c.84.84 2.181.876 3.063.105l.113-.105 4.022-4.022c.84-.84.876-2.181.105-3.064l-.105-.112-1.411-1.411a2.246 2.246 0 00-3.063-.105l-.113.105L13.2 6.213a.749.749 0 01-1.126-.982l.067-.076L13.2 4.096zM8.119 9.177a3.743 3.743 0 015.148-.137l.144.137.706.706a.749.749 0 01-.982 1.125l-.076-.067-.706-.705a2.246 2.246 0 00-3.063-.105l-.113.105-4.022 4.022a2.246 2.246 0 00-.105 3.064l.105.112 1.411 1.411c.84.84 2.181.876 3.063.105l.113-.105 1.058-1.058a.749.749 0 011.126.982l-.067.076-1.059 1.059a3.743 3.743 0 01-5.148.137l-.144-.137-1.412-1.412a3.743 3.743 0 01-.137-5.148l.137-.144L8.12 9.177z" fill="currentcolor" fill-rule="evenodd"></path></svg>`;
	if (Array.isArray(payload) && payload.length > 0) {
		markup = `<div class="summary">${formatCount(
			payload.length,
			"image",
			"images"
		)} found</div>`;
		markup += `<div class="assetsList">`;

		payload.forEach((asset) => {
			markup += `<div class="asset">`;
			markup += `<img class="preview" src="${asset.url}">`;
			markup += `<div class="fileName">${asset.name}</div>`;
			markup += `<button class="actionCopy" data-sqsp-clipboard="${asset.url}" title="Copy URL">${copyIcon}</button>`;
			markup += `</div>`;
		});

		markup += `</div>`;
	} else {
		markup = "No image found.";
	}

	return markup;
}

function formatCount(count, singular, plural) {
	if (count === 1) {
		return count + " " + singular;
	} else {
		return count + " " + plural;
	}
}
