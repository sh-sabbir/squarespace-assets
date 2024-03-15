function grabAssets() {
	let assets = [];
	const tableRows = document.querySelectorAll("tbody tr");

	tableRows.forEach((row) => {
		const cells = row.querySelectorAll("td");
		const imageCell = cells[1]; // 2nd td
		const img = imageCell.querySelector("img");

		if (img && !img.src.includes("//video.")) {
			let url = new URL(img.src);
			url.search = "";
			url = url.toString();

			const fileName = url.substring(url.lastIndexOf("/") + 1);

			assets.push({
				name: fileName,
				url: url,
			});
		}
	});
	chrome.runtime.sendMessage({ sqspAssets: assets });
}
grabAssets();
