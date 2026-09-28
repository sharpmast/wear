import { a as slideUp, i as slideDown, n as getHash, r as setHash, t as dataMediaQueries } from "./app.min.js";
//#region src/components/layout/tabs/tabs.js
function tabs() {
	const tabs = document.querySelectorAll("[data-fls-tabs]");
	let tabsActiveHash = [];
	if (tabs.length > 0) {
		const hash = getHash();
		if (hash && hash.startsWith("tab-")) tabsActiveHash = hash.replace("tab-", "").split("-");
		tabs.forEach((tabsBlock, index) => {
			tabsBlock.classList.add("--tab-init");
			tabsBlock.setAttribute("data-fls-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		});
		let mdQueriesArray = dataMediaQueries(tabs, "flsTabs");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
	}
	function setTitlePosition(tabsMediaArray, matchMedia) {
		tabsMediaArray.forEach((tabsMediaItem) => {
			tabsMediaItem = tabsMediaItem.item;
			let tabsTitles = tabsMediaItem.querySelector("[data-fls-tabs-titles]");
			let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-title]");
			let tabsContent = tabsMediaItem.querySelector("[data-fls-tabs-body]");
			let tabsContentItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-item]");
			tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
			tabsContentItems.forEach((tabsContentItem, index) => {
				if (matchMedia.matches) {
					tabsContent.append(tabsTitleItems[index]);
					tabsContent.append(tabsContentItem);
					tabsMediaItem.classList.add("--tab-spoller");
				} else {
					tabsTitles.append(tabsTitleItems[index]);
					tabsMediaItem.classList.remove("--tab-spoller");
				}
			});
		});
	}
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-body]>*");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
		if (tabsActiveHashBlock) {
			const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
			tabsActiveTitle && tabsActiveTitle.classList.remove("--tab-active");
		}
		if (tabsContent.length) tabsContent.forEach((tabsContentItem, index) => {
			tabsTitles[index].setAttribute("data-fls-tabs-title", "");
			tabsContentItem.setAttribute("data-fls-tabs-item", "");
			if (tabsActiveHashBlock && index == tabsActiveHash[1]) tabsTitles[index].classList.add("--tab-active");
			tabsContentItem.hidden = !tabsTitles[index].classList.contains("--tab-active");
		});
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-fls-tabs-animate")) return tabsBlock.dataset.flsTabsAnimate > 0 ? Number(tabsBlock.dataset.flsTabsAnimate) : 500;
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			const isHash = tabsBlock.hasAttribute("data-fls-tabs-hash");
			tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
			tabsContent.forEach((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains("--tab-active")) {
					tabsContentItem.hidden = false;
					tabsContentItem.style.removeProperty("display");
					if (tabsBlockAnimate) slideDown(tabsContentItem, tabsBlockAnimate);
					tabsContentItem.style.opacity = "0";
					tabsContentItem.style.transform = "translateY(35px) scale(0.985)";
					tabsContentItem.style.transition = "opacity 450ms ease, transform 650ms cubic-bezier(0.22, 1, 0.36, 1)";
					requestAnimationFrame(() => {
						tabsContentItem.style.opacity = "1";
						tabsContentItem.style.transform = "translateY(0) scale(1)";
					});
					if (isHash && !tabsContentItem.closest(".popup")) setHash(`tab-${tabsBlockIndex}-${index}`);
				} else {
					if (tabsBlockAnimate) slideUp(tabsContentItem, tabsBlockAnimate);
					else tabsContentItem.hidden = true;
					tabsContentItem.style.opacity = "";
					tabsContentItem.style.transform = "";
					tabsContentItem.style.removeProperty("transition");
				}
			});
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-fls-tabs-title]")) {
			const tabTitle = el.closest("[data-fls-tabs-title]");
			const tabsBlock = tabTitle.closest("[data-fls-tabs]");
			if (!tabTitle.classList.contains("--tab-active") && !tabsBlock.querySelector(".--slide")) {
				let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
				tabActiveTitle.length && (tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock));
				tabActiveTitle.length && tabActiveTitle[0].classList.remove("--tab-active");
				tabTitle.classList.add("--tab-active");
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
window.addEventListener("load", tabs);
//#endregion
//#region src/components/pages/product/product.js
document.querySelectorAll(".card-product__color").forEach((colorBlock) => {
	const buttons = colorBlock.querySelectorAll(".card-product__color-btn");
	const title = colorBlock.querySelector("[data-color-title]");
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			buttons.forEach((btn) => {
				btn.classList.remove("active");
				btn.querySelector("span").className = "";
			});
			button.classList.add("active");
			const color = button.dataset.value;
			const name = button.dataset.name;
			button.querySelector("span").classList.add(color);
			title.textContent = name;
		});
	});
});
document.querySelectorAll(".card-product__size").forEach((sizeBlock) => {
	const buttons = sizeBlock.querySelectorAll(".card-product__size-btn");
	const title = sizeBlock.querySelector("[data-size-title]");
	buttons.forEach((button) => {
		button.addEventListener("click", () => {
			buttons.forEach((btn) => {
				btn.classList.remove("active");
				btn.querySelector("span").className = "";
			});
			button.classList.add("active");
			const size = button.dataset.value.toUpperCase();
			button.querySelector("span").classList.add(size);
			title.textContent = size;
		});
	});
});
var slider = document.querySelector(".product-caption__top");
var isDown = false;
var startX;
var scrollLeft;
slider.addEventListener("mousedown", (e) => {
	isDown = true;
	slider.classList.add("active");
	startX = e.pageX - slider.offsetLeft;
	scrollLeft = slider.scrollLeft;
});
slider.addEventListener("mouseleave", () => {
	isDown = false;
});
slider.addEventListener("mouseup", () => {
	isDown = false;
});
slider.addEventListener("mousemove", (e) => {
	if (!isDown) return;
	e.preventDefault();
	const walk = (e.pageX - slider.offsetLeft - startX) * 1.5;
	slider.scrollLeft = scrollLeft - walk;
});
//#endregion
