//#region \0vite/modulepreload-polyfill.js
(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
})();
//#endregion
//#region src/js/common/functions.js
function getHash() {
	if (location.hash) return location.hash.replace("#", "");
}
function setHash(hash) {
	hash = hash ? `#${hash}` : window.location.href.split("#")[0];
	history.pushState("", "", hash);
}
var slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false;
			!showmore && target.style.removeProperty("height");
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore && target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
		}, duration);
	}
};
var slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("--slide")) {
		target.classList.add("--slide");
		target.hidden = target.hidden ? false : null;
		showmore && target.style.removeProperty("height");
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout(() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("--slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
		}, duration);
	}
};
var slideToggle = (target, duration = 500) => {
	if (target.hidden) return slideDown(target, duration);
	else return slideUp(target, duration);
};
function getDigFormat(item, sepp = " ") {
	return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
function uniqArray(array) {
	return array.filter((item, index, self) => self.indexOf(item) === index);
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
		const [value, type = "max"] = item.dataset[dataSetValue].split(",");
		return {
			value,
			type,
			item
		};
	});
	if (media.length === 0) return [];
	const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
	return [...new Set(breakpointsArray)].map((query) => {
		const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
		const matchMedia = window.matchMedia(mediaQuery);
		return {
			itemsArray: media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType),
			matchMedia
		};
	});
}
//#endregion
//#region src/components/layout/spollers/spollers.js
function spollers() {
	const spollersArray = document.querySelectorAll("[data-fls-spollers]");
	if (spollersArray.length > 0) {
		document.addEventListener("click", setSpollerAction);
		const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
			return !item.dataset.flsSpollers.split(",")[0];
		});
		if (spollersRegular.length) initSpollers(spollersRegular);
		let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem) => {
			mdQueriesItem.matchMedia.addEventListener("change", function() {
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
			initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		});
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock) => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("--spoller-init");
					initSpollerBody(spollersBlock);
				} else {
					spollersBlock.classList.remove("--spoller-init");
					initSpollerBody(spollersBlock, false);
				}
			});
		}
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerItems = spollersBlock.querySelectorAll("details");
			if (spollerItems.length) spollerItems.forEach((spollerItem) => {
				let spollerTitle = spollerItem.querySelector("summary");
				if (hideSpollerBody) {
					spollerTitle.removeAttribute("tabindex");
					if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
						spollerItem.open = false;
						spollerTitle.nextElementSibling.hidden = true;
					} else {
						spollerTitle.classList.add("--spoller-active");
						spollerItem.open = true;
					}
				} else {
					spollerTitle.setAttribute("tabindex", "-1");
					spollerTitle.classList.remove("--spoller-active");
					spollerItem.open = true;
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
				e.preventDefault();
				if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
					const spollerTitle = el.closest("summary");
					const spollerBlock = spollerTitle.closest("details");
					const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
					const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
					const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
					const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
					if (!spollersBlock.querySelectorAll(".--slide").length) {
						if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
						!spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
							spollerBlock.open = false;
						}, spollerSpeed);
						spollerTitle.classList.toggle("--spoller-active");
						slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
						if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
							const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
							const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
							const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
							window.scrollTo({
								top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
								behavior: "smooth"
							});
						}
					}
				}
			}
			if (!el.closest("[data-fls-spollers]")) {
				const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
				if (spollersClose.length) spollersClose.forEach((spollerClose) => {
					const spollersBlock = spollerClose.closest("[data-fls-spollers]");
					const spollerCloseBlock = spollerClose.parentNode;
					if (spollersBlock.classList.contains("--spoller-init")) {
						const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
						spollerClose.classList.remove("--spoller-active");
						slideUp(spollerClose.nextElementSibling, spollerSpeed);
						setTimeout(() => {
							spollerCloseBlock.open = false;
						}, spollerSpeed);
					}
				});
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveBlock = spollersBlock.querySelector("details[open]");
			if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
				const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
				const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
				spollerActiveTitle.classList.remove("--spoller-active");
				slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				setTimeout(() => {
					spollerActiveBlock.open = false;
				}, spollerSpeed);
			}
		}
	}
}
window.addEventListener("load", spollers);
//#endregion
//#region src/components/layout/header/header.js
var menuBtn = document.querySelector(".menu__icon");
var mobMenu = document.querySelector(".menu");
var wrapper$1 = document.querySelector(".wrapper");
if (menuBtn && mobMenu && wrapper$1) {
	menuBtn.addEventListener("click", () => {
		menuBtn.classList.toggle("menu__icon--active");
		mobMenu.classList.toggle("menu--active");
		wrapper$1.classList.toggle("wrapper--active");
	});
	document.addEventListener("click", (event) => {
		const isMenuOpen = mobMenu.classList.contains("menu--active");
		const clickedOutsideMenu = !mobMenu.contains(event.target);
		const clickedOutsideBtn = !menuBtn.contains(event.target);
		if (isMenuOpen && clickedOutsideMenu && clickedOutsideBtn) {
			menuBtn.classList.remove("menu__icon--active");
			mobMenu.classList.remove("menu--active");
			wrapper$1.classList.remove("wrapper--active");
		}
	});
}
document.querySelectorAll(".menu__link").forEach((item) => {
	item.addEventListener("click", (event) => {
		const href = item.getAttribute("href");
		if (!href) return;
		if (href.startsWith("#")) {
			event.preventDefault();
			if (menuBtn && mobMenu && wrapper$1) {
				menuBtn.classList.remove("menu__icon--active");
				mobMenu.classList.remove("menu--active");
				wrapper$1.classList.remove("wrapper--active");
			}
			const blockId = href.substring(1);
			const targetBlock = document.getElementById(blockId);
			if (targetBlock) targetBlock.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}
	});
});
var links = document.querySelectorAll(".menu__link");
var currentPath = window.location.pathname.split("/").pop() || "index.html";
var currentHash = window.location.hash;
links.forEach((link) => {
	const href = link.getAttribute("href");
	if (!href) return;
	link.classList.remove("link-visit");
	if (href.startsWith("#")) {
		if (currentPath === "index.html" && href === currentHash) link.classList.add("link-visit");
		return;
	}
	const linkUrl = new URL(href, window.location.href);
	const linkPath = linkUrl.pathname.split("/").pop() || "index.html";
	const linkHash = linkUrl.hash;
	if (linkHash) {
		if (linkPath === currentPath && linkHash === currentHash) link.classList.add("link-visit");
	} else if (linkPath === currentPath && !currentHash) link.classList.add("link-visit");
});
function initWaterButtons() {
	document.querySelectorAll("[data-water-button] [data-water-canvas]").forEach((canvas) => {
		if (canvas._waterCleanup) return;
		const ctx = canvas.getContext("2d");
		const wrapper = canvas.closest("[data-water-button]");
		const button = wrapper ? Array.from(wrapper.children).find((element) => element !== canvas) : null;
		if (!ctx || !wrapper || !button) return;
		const SIZE = 240;
		const EXTRA = 120;
		const DAMPING = .97;
		const BORDER = 35;
		const RIPPLE_INTERVAL = 7500;
		canvas.width = SIZE;
		canvas.height = SIZE;
		Object.assign(wrapper.style, {
			position: "relative",
			isolation: "isolate",
			overflow: "visible"
		});
		Object.assign(canvas.style, {
			position: "absolute",
			left: "50%",
			top: "50%",
			transform: "translate(-50%, -50%)",
			pointerEvents: "none",
			zIndex: "-1"
		});
		let currentBuffer = /* @__PURE__ */ new Float32Array(57600);
		let previousBuffer = /* @__PURE__ */ new Float32Array(57600);
		const imageData = ctx.createImageData(SIZE, SIZE);
		const pixels = imageData.data;
		let animationFrame = null;
		let rippleTimer = null;
		let running = false;
		let destroyed = false;
		let isVisible = false;
		let hasWaveEnergy = false;
		function resizeCanvas() {
			const rect = button.getBoundingClientRect();
			canvas.style.width = `${rect.width + EXTRA}px`;
			canvas.style.height = `${rect.height + EXTRA}px`;
		}
		resizeCanvas();
		const resizeObserver = new ResizeObserver(resizeCanvas);
		resizeObserver.observe(button);
		function disturb(x, y, radius = 8, strength = 100) {
			for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
				const distance = Math.hypot(dx, dy);
				if (distance > radius) continue;
				const px = Math.round(x + dx);
				const py = Math.round(y + dy);
				if (px < 3 || px >= 237 || py < 3 || py >= 237) continue;
				const index = py * SIZE + px;
				const power = 1 - distance / radius;
				previousBuffer[index] += strength * power;
			}
		}
		function makeOutlineRipple() {
			const rect = button.getBoundingClientRect();
			if (!rect.width || !rect.height) return;
			const scaleX = SIZE / (rect.width + EXTRA);
			const scaleY = SIZE / (rect.height + EXTRA);
			const left = EXTRA / 2 * scaleX;
			const right = (EXTRA / 2 + rect.width) * scaleX;
			const top = EXTRA / 2 * scaleY;
			const bottom = (EXTRA / 2 + rect.height) * scaleY;
			const style = getComputedStyle(button);
			function getRadius(value, reference, scale) {
				const parsed = parseFloat(value) || 0;
				return (value.includes("%") ? reference * parsed / 100 : parsed) * scale;
			}
			const radiusX = Math.min(getRadius(style.borderTopLeftRadius, rect.width, scaleX), (right - left) / 2, (bottom - top) / 2);
			const radiusY = Math.min(getRadius(style.borderTopLeftRadius, rect.height, scaleY), (right - left) / 2, (bottom - top) / 2);
			const step = 5;
			for (let x = left + radiusX; x <= right - radiusX; x += step) {
				disturb(x, top);
				disturb(x, bottom);
			}
			for (let y = top + radiusY; y <= bottom - radiusY; y += step) {
				disturb(left, y);
				disturb(right, y);
			}
			const corners = [
				[
					left + radiusX,
					top + radiusY,
					Math.PI,
					Math.PI * 1.5
				],
				[
					right - radiusX,
					top + radiusY,
					Math.PI * 1.5,
					Math.PI * 2
				],
				[
					right - radiusX,
					bottom - radiusY,
					0,
					Math.PI * .5
				],
				[
					left + radiusX,
					bottom - radiusY,
					Math.PI * .5,
					Math.PI
				]
			];
			for (const [cx, cy, start, end] of corners) {
				const count = Math.max(4, Math.ceil(Math.max(radiusX, radiusY) * (end - start) / step));
				for (let i = 0; i <= count; i++) {
					const angle = start + (end - start) * i / count;
					disturb(cx + Math.cos(angle) * radiusX, cy + Math.sin(angle) * radiusY);
				}
			}
		}
		function updateWater() {
			let maxEnergy = 0;
			for (let y = 1; y < 239; y++) for (let x = 1; x < 239; x++) {
				const index = y * SIZE + x;
				const nextValue = ((previousBuffer[index - 1] + previousBuffer[index + 1] + previousBuffer[index - SIZE] + previousBuffer[index + SIZE]) / 2 - currentBuffer[index]) * DAMPING;
				currentBuffer[index] = nextValue;
				const energy = Math.abs(nextValue);
				if (energy > maxEnergy) maxEnergy = energy;
			}
			for (let y = 0; y < SIZE; y++) for (let x = 0; x < BORDER; x++) {
				const fade = x / BORDER;
				const factor = fade * fade;
				const left = y * SIZE + x;
				const right = y * SIZE + SIZE - 1 - x;
				currentBuffer[left] *= factor;
				previousBuffer[left] *= factor;
				currentBuffer[right] *= factor;
				previousBuffer[right] *= factor;
			}
			for (let y = 0; y < BORDER; y++) {
				const fade = y / BORDER;
				const factor = fade * fade;
				for (let x = 0; x < SIZE; x++) {
					const top = y * SIZE + x;
					const bottom = (239 - y) * SIZE + x;
					currentBuffer[top] *= factor;
					previousBuffer[top] *= factor;
					currentBuffer[bottom] *= factor;
					previousBuffer[bottom] *= factor;
				}
			}
			const temp = currentBuffer;
			currentBuffer = previousBuffer;
			previousBuffer = temp;
			hasWaveEnergy = maxEnergy > .1;
		}
		function renderWater() {
			const center = SIZE / 2;
			const rect = button.getBoundingClientRect();
			const canvasWidth = rect.width + EXTRA;
			const canvasHeight = rect.height + EXTRA;
			const halfWidth = rect.width / canvasWidth * center;
			const halfHeight = rect.height / canvasHeight * center;
			for (let y = 1; y < 239; y++) for (let x = 1; x < 239; x++) {
				const index = y * SIZE + x;
				const left = previousBuffer[index - 1];
				const right = previousBuffer[index + 1];
				const top = previousBuffer[index - SIZE];
				const bottom = previousBuffer[index + SIZE];
				const dx = right - left;
				const dy = bottom - top;
				const brightness = Math.max(0, Math.min(255, 128 + dx * 10 + dy * 10));
				const nx = (x - center) / halfWidth;
				const ny = (y - center) / halfHeight;
				const fade = Math.max(0, Math.min(1, (1.8 - Math.hypot(nx, ny)) / .8));
				const wave = Math.abs(previousBuffer[index]);
				const alpha = Math.min(150, wave * 2) * fade;
				const pixel = index * 4;
				pixels[pixel] = brightness;
				pixels[pixel + 1] = brightness;
				pixels[pixel + 2] = brightness;
				pixels[pixel + 3] = alpha;
			}
			ctx.putImageData(imageData, 0, 0);
		}
		function animate() {
			if (destroyed || !isVisible) {
				running = false;
				animationFrame = null;
				return;
			}
			updateWater();
			renderWater();
			if (hasWaveEnergy) animationFrame = requestAnimationFrame(animate);
			else {
				running = false;
				animationFrame = null;
				ctx.clearRect(0, 0, SIZE, SIZE);
			}
		}
		function startAnimation() {
			if (running || destroyed || !isVisible) return;
			running = true;
			animationFrame = requestAnimationFrame(animate);
		}
		function createRipple() {
			if (destroyed || !isVisible) return;
			makeOutlineRipple();
			startAnimation();
		}
		const visibilityObserver = new IntersectionObserver(([entry]) => {
			isVisible = entry.isIntersecting;
			if (isVisible) {
				createRipple();
				if (!rippleTimer) rippleTimer = window.setInterval(createRipple, RIPPLE_INTERVAL);
			} else {
				if (animationFrame !== null) {
					cancelAnimationFrame(animationFrame);
					animationFrame = null;
				}
				running = false;
				window.clearInterval(rippleTimer);
				rippleTimer = null;
				currentBuffer.fill(0);
				previousBuffer.fill(0);
				hasWaveEnergy = false;
				ctx.clearRect(0, 0, SIZE, SIZE);
			}
		}, { threshold: 0 });
		visibilityObserver.observe(wrapper);
		canvas._waterCleanup = () => {
			destroyed = true;
			window.clearInterval(rippleTimer);
			visibilityObserver.disconnect();
			resizeObserver.disconnect();
			if (animationFrame !== null) {
				cancelAnimationFrame(animationFrame);
				animationFrame = null;
			}
			running = false;
			currentBuffer.fill(0);
			previousBuffer.fill(0);
			ctx.clearRect(0, 0, SIZE, SIZE);
			delete canvas._waterCleanup;
		};
	});
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initWaterButtons, { once: true });
else initWaterButtons();
//#endregion
//#region src/components/layout/header/plugins/scroll/scroll.js
function headerScroll() {
	const header = document.querySelector("[data-fls-header-scroll]");
	const headerShow = header.hasAttribute("data-fls-header-scroll-show");
	const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
	const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
	let scrollDirection = 0;
	let timer;
	document.addEventListener("scroll", function(e) {
		const scrollTop = window.scrollY;
		clearTimeout(timer);
		if (scrollTop >= startPoint) {
			!header.classList.contains("--header-scroll") && header.classList.add("--header-scroll");
			if (headerShow) {
				if (scrollTop > scrollDirection) header.classList.contains("--header-show") && header.classList.remove("--header-show");
				else !header.classList.contains("--header-show") && header.classList.add("--header-show");
				timer = setTimeout(() => {
					!header.classList.contains("--header-show") && header.classList.add("--header-show");
				}, headerShowTimer);
			}
		} else {
			header.classList.contains("--header-scroll") && header.classList.remove("--header-scroll");
			if (headerShow) header.classList.contains("--header-show") && header.classList.remove("--header-show");
		}
		scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
	});
}
document.querySelector("[data-fls-header-scroll]") && window.addEventListener("load", headerScroll);
//#endregion
//#region src/components/layout/footer/footer.js
var button = document.querySelector(".button-action__btn");
if (button) {
	let current = 0;
	let target = 0;
	let lastScroll = window.scrollY;
	let animationFrame = null;
	let scrollTimer = null;
	function animate() {
		current += (target - current) * .08;
		button.style.transform = `translate3d(0, ${current}px, 0)`;
		if (Math.abs(target - current) < .1 && Math.abs(current) < .1) {
			current = 0;
			target = 0;
			button.style.transform = "translate3d(0, 0, 0)";
			animationFrame = null;
			return;
		}
		animationFrame = requestAnimationFrame(animate);
	}
	window.addEventListener("scroll", () => {
		const scroll = window.scrollY;
		const delta = scroll - lastScroll;
		lastScroll = scroll;
		target -= delta * .35;
		target = Math.max(-40, Math.min(40, target));
		if (!animationFrame) animationFrame = requestAnimationFrame(animate);
		clearTimeout(scrollTimer);
		scrollTimer = setTimeout(() => {
			target = 0;
			if (!animationFrame) animationFrame = requestAnimationFrame(animate);
		}, 120);
	}, { passive: true });
}
var canvas = document.querySelector(".button-action__water");
if (canvas) {
	const ctx = canvas.getContext("2d");
	const SIZE = 320;
	canvas.width = SIZE;
	canvas.height = SIZE;
	const damping = .97;
	const currentBuffer = new Float32Array(SIZE * SIZE);
	const previousBuffer = new Float32Array(SIZE * SIZE);
	const imageData = ctx.createImageData(SIZE, SIZE);
	const pixels = imageData.data;
	function makeRipple(x, y) {
		const radius = 12;
		const strength = 1100;
		for (let dy = -12; dy <= radius; dy++) for (let dx = -12; dx <= radius; dx++) {
			const distance = Math.sqrt(dx * dx + dy * dy);
			if (distance > radius) continue;
			const px = Math.round(x + dx);
			const py = Math.round(y + dy);
			if (px < 3 || px >= 317 || py < 3 || py >= 317) continue;
			const index = py * SIZE + px;
			const power = 1 - distance / radius;
			previousBuffer[index] += strength * power;
		}
	}
	function updateWater() {
		for (let y = 1; y < 319; y++) for (let x = 1; x < 319; x++) {
			const index = y * SIZE + x;
			const value = (previousBuffer[index - 1] + previousBuffer[index + 1] + previousBuffer[index - SIZE] + previousBuffer[index + SIZE]) / 2 - currentBuffer[index];
			currentBuffer[index] = value * damping;
		}
		const border = 35;
		for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
			const distanceToEdge = Math.min(x, y, 319 - x, 319 - y);
			if (distanceToEdge < border) {
				const fade = distanceToEdge / border;
				const index = y * SIZE + x;
				currentBuffer[index] *= fade * fade;
				previousBuffer[index] *= fade * fade;
			}
		}
		for (let i = 0; i < currentBuffer.length; i++) {
			const temp = currentBuffer[i];
			currentBuffer[i] = previousBuffer[i];
			previousBuffer[i] = temp;
		}
	}
	function renderWater() {
		const center = SIZE / 2;
		const maxRadius = SIZE * .46;
		for (let y = 1; y < 319; y++) for (let x = 1; x < 319; x++) {
			const index = y * SIZE + x;
			const left = previousBuffer[index - 1];
			const right = previousBuffer[index + 1];
			const top = previousBuffer[index - SIZE];
			const bottom = previousBuffer[index + SIZE];
			const dx = right - left;
			const dy = bottom - top;
			const light = 128 + dx * 10 + dy * 10;
			const brightness = Math.max(0, Math.min(255, light));
			let fade = 1 - Math.sqrt((x - center) * (x - center) + (y - center) * (y - center)) / maxRadius;
			fade = Math.max(0, Math.min(1, fade));
			fade = fade * fade;
			let alpha = Math.abs(previousBuffer[index]) * 2;
			alpha = Math.min(150, alpha);
			alpha *= fade;
			const pixel = index * 4;
			pixels[pixel] = brightness;
			pixels[pixel + 1] = brightness;
			pixels[pixel + 2] = brightness;
			pixels[pixel + 3] = alpha;
		}
		ctx.putImageData(imageData, 0, 0);
	}
	function animate() {
		updateWater();
		renderWater();
		requestAnimationFrame(animate);
	}
	function createRipple() {
		makeRipple(SIZE / 2, SIZE / 2);
	}
	createRipple();
	setInterval(createRipple, 4500);
	animate();
}
//#endregion
//#region src/components/layout/dynamic/dynamic.js
var DynamicAdapt = class {
	constructor() {
		this.type = "max";
		this.init();
	}
	init() {
		this.objects = [];
		this.daClassname = "--dynamic";
		this.nodes = [...document.querySelectorAll("[data-fls-dynamic]")];
		this.nodes.forEach((node) => {
			const dataArray = node.dataset.flsDynamic.trim().split(`,`);
			const object = {};
			object.element = node;
			object.parent = node.parentNode;
			object.destinationParent = dataArray[3] ? node.closest(dataArray[3].trim()) || document : document;
			const parentObjectSelector = dataArray[3] ? dataArray[3].trim() : null;
			const objectSelector = dataArray[0] ? dataArray[0].trim() : null;
			if (objectSelector) {
				if (parentObjectSelector) `${parentObjectSelector}${objectSelector}`;
				const foundDestination = object.destinationParent.querySelector(objectSelector);
				if (foundDestination) object.destination = foundDestination;
			}
			object.breakpoint = dataArray[1] ? dataArray[1].trim() : `767.98`;
			object.place = dataArray[2] ? dataArray[2].trim() : `last`;
			object.index = this.indexInParent(object.parent, object.element);
			this.objects.push(object);
		});
		this.arraySort(this.objects);
		this.mediaQueries = this.objects.map(({ breakpoint }) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`).filter((item, index, self) => self.indexOf(item) === index);
		this.mediaQueries.forEach((media) => {
			const mediaSplit = media.split(",");
			const matchMedia = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];
			const objectsFilter = this.objects.filter(({ breakpoint }) => breakpoint === mediaBreakpoint);
			matchMedia.addEventListener("change", () => {
				this.mediaHandler(matchMedia, objectsFilter);
			});
			this.mediaHandler(matchMedia, objectsFilter);
		});
	}
	mediaHandler(matchMedia, objects) {
		if (matchMedia.matches) objects.forEach((object) => {
			if (object.destination) this.moveTo(object.place, object.element, object.destination);
		});
		else objects.forEach(({ parent, element, index }) => {
			if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
		});
	}
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);
		const index = place === "last" || place === "first" ? place : parseInt(place, 10);
		if (index === "last" || index >= destination.children.length) destination.append(element);
		else if (index === "first") destination.prepend(element);
		else destination.children[index].before(element);
	}
	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== void 0) parent.children[index].before(element);
		else parent.append(element);
	}
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}
	arraySort(arr) {
		if (this.type === "min") arr.sort((a, b) => {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) return 0;
				if (a.place === "first" || b.place === "last") return -1;
				if (a.place === "last" || b.place === "first") return 1;
				return 0;
			}
			return a.breakpoint - b.breakpoint;
		});
		else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) return 0;
					if (a.place === "first" || b.place === "last") return 1;
					if (a.place === "last" || b.place === "first") return -1;
					return 0;
				}
				return b.breakpoint - a.breakpoint;
			});
			return;
		}
	}
};
if (document.querySelector("[data-fls-dynamic]")) window.addEventListener("load", () => new DynamicAdapt());
//#endregion
//#region src/components/layout/cart/cart.js
var cart = document.querySelector(".cart");
var cartIcon = document.querySelector(".header__btn-cart");
var wrapper = document.querySelector(".wrapper");
var cartActive = (e) => {
	if (!e.target.closest(".cart-action") || !cart) return;
	if (!cart.classList.contains("--active")) {
		openCart();
		wrapper.classList.add("wrapper--active");
		return;
	}
	cart.classList.add("--closing");
	wrapper.classList.remove("wrapper--active");
};
document.addEventListener("click", cartActive);
function openCart() {
	const iconRect = cartIcon.getBoundingClientRect();
	const x = iconRect.left + iconRect.width / 2 - window.innerWidth / 2;
	const y = iconRect.top + iconRect.height / 2 - window.innerHeight / 2;
	cart.style.setProperty("--cart-x", `${x}px`);
	cart.style.setProperty("--cart-y", `${y}px`);
	cart.classList.remove("--closing");
	cart.classList.add("--active");
}
cart.addEventListener("animationend", (e) => {
	if (e.animationName === "cart-close") cart.classList.remove("--active", "--closing");
});
document.addEventListener("click", async function(e) {
	if (e.target.id === "sendBtn") {
		const name = document.getElementById("name").value.trim();
		const phone = document.getElementById("phone").value.trim();
		const message = document.getElementById("message").value.trim();
		const status = document.getElementById("status");
		if (!name || !phone) {
			status.innerText = "Заповніть ім'я та телефон!";
			status.style.color = "red";
			return;
		}
		status.innerText = "Відправка...";
		status.style.color = "black";
		try {
			await fetch("/.netlify/functions/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					phone,
					message
				})
			});
			status.innerText = "✅ Відправлено!";
			status.style.color = "green";
			setTimeout(() => {
				document.getElementById("modal").classList.remove("--active");
				document.querySelector(".wrapper").classList.remove("wrapper--active");
			}, 1500);
		} catch {
			status.innerText = "❌ Помилка!";
			status.style.color = "red";
		}
	}
});
//#endregion
//#region src/components/forms/quantity/quantity.js
function formQuantity() {
	document.addEventListener("click", quantityActions);
	document.addEventListener("keyup", quantityActions);
	function quantityActions(e) {
		const type = e.type;
		const targetElement = e.target;
		if (type === "click") {
			if (targetElement.closest("[data-fls-quantity-plus]") || targetElement.closest("[data-fls-quantity-minus]")) {
				const valueElement = targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]");
				let value = parseInt(valueElement.value);
				if (targetElement.hasAttribute("data-fls-quantity-plus")) {
					value++;
					if (+valueElement.dataset.flsQuantityMax && +valueElement.dataset.flsQuantityMax < value) value = valueElement.dataset.flsQuantityMax;
				} else {
					--value;
					if (+valueElement.dataset.flsQuantityMin) {
						if (+valueElement.dataset.flsQuantityMin > value) value = valueElement.dataset.flsQuantityMin;
					} else if (value < 1) value = 1;
				}
				targetElement.closest("[data-fls-quantity]").querySelector("[data-fls-quantity-value]").value = value;
			}
		} else if (type === "keyup") {
			if (targetElement.closest("[data-fls-quantity-value]")) {
				const valueElement = targetElement.closest("[data-fls-quantity-value]");
				console.log(valueElement.value);
				(valueElement.value == 0 || /[^0-9]/gi.test(valueElement.value)) && (valueElement.value = 1);
			}
		}
	}
}
window.addEventListener("load", formQuantity);
//#endregion
//#region src/components/effects/preloader/preloader.js
function preloader() {
	const preloaderImages = document.querySelectorAll("img");
	const htmlDocument = document.documentElement;
	const isPreloaded = localStorage.getItem(location.href) && document.querySelector("[data-fls-preloader=\"true\"]");
	if (preloaderImages.length && !isPreloaded) {
		document.body.insertAdjacentHTML("beforeend", `
		  <div class="fls-preloader">
        <div class="fls-preloader__body">
            <img
                class="fls-preloader__logo"
                src="assets/img/sv_logo.webp"
                alt="Logo"
            >
        </div>
    </div>
		`);
		document.querySelector(".fls-preloader");
		const showPecentLoad = document.querySelector(".fls-preloader__counter"), showLineLoad = document.querySelector(".fls-preloader__line span");
		let imagesLoadedCount = 0;
		let counter = 0;
		let progress = 0;
		htmlDocument.setAttribute("data-fls-preloader-loading", "");
		htmlDocument.setAttribute("data-fls-scrolllock", "");
		preloaderImages.forEach((preloaderImage) => {
			const imgClone = document.createElement("img");
			if (imgClone) {
				imgClone.onload = imageLoaded;
				imgClone.onerror = imageLoaded;
				preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
			}
		});
		function setValueProgress(progress) {
			showPecentLoad && (showPecentLoad.innerText = `${progress}%`);
			showLineLoad && (showLineLoad.style.width = `${progress}%`);
		}
		setValueProgress(progress);
		function imageLoaded() {
			imagesLoadedCount++;
			progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
			const intervalId = setInterval(() => {
				counter >= progress ? clearInterval(intervalId) : setValueProgress(++counter);
				counter >= 100 && addLoadedClass();
			}, 10);
		}
		const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
		document.querySelector("[data-fls-preloader=\"true\"]") && preloaderOnce();
	} else addLoadedClass();
	function addLoadedClass() {
		htmlDocument.setAttribute("data-fls-preloader-loaded", "");
		htmlDocument.removeAttribute("data-fls-preloader-loading");
		htmlDocument.removeAttribute("data-fls-scrolllock");
	}
}
document.addEventListener("DOMContentLoaded", preloader);
//#endregion
//#region src/components/pages/home/home.js
var show = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) entry.target.classList.add("visible");
		if (!entry.isIntersecting) entry.target.classList.remove("visible");
	});
});
document.querySelectorAll(".show").forEach((item) => {
	show.observe(item);
});
document.querySelectorAll("[data-scroll-text]").forEach((text) => {
	text.innerHTML = text.textContent.trim().split(/\s+/).map((word) => `<span>${word}</span>`).join(" ");
	const spans = [...text.querySelectorAll("span")];
	let targetWords = 0;
	let activeWords = 0;
	let animationTimer = null;
	function updateText() {
		const rect = text.getBoundingClientRect();
		const distance = window.innerHeight * .65 - rect.top;
		const distancePerWord = text.offsetHeight / spans.length;
		targetWords = Math.min(Math.max(Math.floor(Math.max(distance, 0) / distancePerWord), 0), spans.length);
		animateWords();
	}
	function animateWords() {
		if (activeWords === targetWords) return;
		clearTimeout(animationTimer);
		animationTimer = setTimeout(() => {
			if (activeWords < targetWords) activeWords++;
			else activeWords--;
			spans.forEach((span, index) => {
				span.classList.toggle("is-active", index < activeWords);
			});
			animateWords();
		}, 30);
	}
	updateText();
	window.addEventListener("scroll", updateText, { passive: true });
	window.addEventListener("resize", updateText);
});
//#endregion
export { slideDown as a, setHash as i, getDigFormat as n, slideUp as o, getHash as r, uniqArray as s, dataMediaQueries as t };
