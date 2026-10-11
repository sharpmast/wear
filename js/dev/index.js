import { n as getDigFormat, s as uniqArray } from "./app.min.js";
import "./slider.min.js";
//#region src/components/effects/watcher/watcher.js
var ScrollWatcher = class {
	constructor(props) {
		let defaultConfig = { logging: true };
		this.config = Object.assign(defaultConfig, props);
		this.observer;
		!document.documentElement.classList.contains("watcher") && this.scrollWatcherRun();
	}
	scrollWatcherUpdate() {
		this.scrollWatcherRun();
	}
	scrollWatcherRun() {
		document.documentElement.classList.add("watcher");
		this.scrollWatcherConstructor(document.querySelectorAll("[data-fls-watcher]"));
	}
	scrollWatcherConstructor(items) {
		if (items.length) {
			this.scrollWatcherLogging(`_FLS_WATCHER_START_WATCH`, items.length);
			uniqArray(Array.from(items).map(function(item) {
				if (item.dataset.flsWatcher === "navigator" && !item.dataset.flsWatcherThreshold) {
					let valueOfThreshold;
					if (item.clientHeight > 2) {
						valueOfThreshold = window.innerHeight / 2 / (item.clientHeight - 1);
						if (valueOfThreshold > 1) valueOfThreshold = 1;
					} else valueOfThreshold = 1;
					item.setAttribute("data-fls-watcher-threshold", valueOfThreshold.toFixed(2));
				}
				return `${item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null}|${item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px"}|${item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0}`;
			})).forEach((uniqParam) => {
				let uniqParamArray = uniqParam.split("|");
				let paramsWatch = {
					root: uniqParamArray[0],
					margin: uniqParamArray[1],
					threshold: uniqParamArray[2]
				};
				let groupItems = Array.from(items).filter(function(item) {
					let watchRoot = item.dataset.flsWatcherRoot ? item.dataset.flsWatcherRoot : null;
					let watchMargin = item.dataset.flsWatcherMargin ? item.dataset.flsWatcherMargin : "0px";
					let watchThreshold = item.dataset.flsWatcherThreshold ? item.dataset.flsWatcherThreshold : 0;
					if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
				});
				let configWatcher = this.getScrollWatcherConfig(paramsWatch);
				this.scrollWatcherInit(groupItems, configWatcher);
			});
		} else this.scrollWatcherLogging("_FLS_WATCHER_SLEEP");
	}
	getScrollWatcherConfig(paramsWatch) {
		let configWatcher = {};
		if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root);
		else if (paramsWatch.root !== "null") this.scrollWatcherLogging(`_FLS_WATCHER_NOPARENT`, paramsWatch.root);
		configWatcher.rootMargin = paramsWatch.margin;
		if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
			this.scrollWatcherLogging(`_FLS_WATCHER_WARN_MARGIN`);
			return;
		}
		if (paramsWatch.threshold === "prx") {
			paramsWatch.threshold = [];
			for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
		} else paramsWatch.threshold = paramsWatch.threshold.split(",");
		configWatcher.threshold = paramsWatch.threshold;
		return configWatcher;
	}
	scrollWatcherCreate(configWatcher) {
		this.observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				this.scrollWatcherCallback(entry, observer);
			});
		}, configWatcher);
	}
	scrollWatcherInit(items, configWatcher) {
		this.scrollWatcherCreate(configWatcher);
		items.forEach((item) => this.observer.observe(item));
	}
	scrollWatcherIntersecting(entry, targetElement) {
		if (entry.isIntersecting) {
			!targetElement.classList.contains("--watcher-view") && targetElement.classList.add("--watcher-view");
			this.scrollWatcherLogging(`_FLS_WATCHER_VIEW`, targetElement.classList[0]);
		} else {
			targetElement.classList.contains("--watcher-view") && targetElement.classList.remove("--watcher-view");
			this.scrollWatcherLogging(`_FLS_WATCHER_NOVIEW`, targetElement.classList[0]);
		}
	}
	scrollWatcherOff(targetElement, observer) {
		observer.unobserve(targetElement);
		this.scrollWatcherLogging(`_FLS_WATCHER_STOP_WATCH`, targetElement.classList[0]);
	}
	scrollWatcherLogging(message, vars) {}
	scrollWatcherCallback(entry, observer) {
		const targetElement = entry.target;
		this.scrollWatcherIntersecting(entry, targetElement);
		targetElement.hasAttribute("data-fls-watcher-once") && entry.isIntersecting && this.scrollWatcherOff(targetElement, observer);
		document.dispatchEvent(new CustomEvent("watcherCallback", { detail: { entry } }));
	}
};
document.querySelector("[data-fls-watcher]") && window.addEventListener("load", () => new ScrollWatcher({}));
//#endregion
//#region src/components/layout/digcounter/digcounter.js
function digitsCounter() {
	function digitsCountersInit(digitsCountersItems) {
		let digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-fls-digcounter]");
		if (digitsCounters.length) digitsCounters.forEach((digitsCounter) => {
			if (digitsCounter.hasAttribute("data-fls-digcounter-go")) return;
			digitsCounter.setAttribute("data-fls-digcounter-go", "");
			digitsCounter.dataset.flsDigcounter = digitsCounter.innerHTML;
			digitsCounter.innerHTML = `0`;
			digitsCountersAnimate(digitsCounter);
		});
	}
	function digitsCountersAnimate(digitsCounter) {
		let startTimestamp = null;
		const duration = parseFloat(digitsCounter.dataset.flsDigcounterSpeed) ? parseFloat(digitsCounter.dataset.flsDigcounterSpeed) : 1e3;
		const startValue = parseFloat(digitsCounter.dataset.flsDigcounter);
		const format = digitsCounter.dataset.flsDigcounterFormat ? digitsCounter.dataset.flsDigcounterFormat : " ";
		const startPosition = 0;
		const step = (timestamp) => {
			if (!startTimestamp) startTimestamp = timestamp;
			const progress = Math.min((timestamp - startTimestamp) / duration, 1);
			const value = Math.floor(progress * (startPosition + startValue));
			digitsCounter.innerHTML = typeof digitsCounter.dataset.flsDigcounterFormat !== "undefined" ? getDigFormat(value, format) : value;
			if (progress < 1) window.requestAnimationFrame(step);
			else digitsCounter.removeAttribute("data-fls-digcounter-go");
		};
		window.requestAnimationFrame(step);
	}
	function digitsCounterAction(e) {
		const entry = e.detail.entry;
		const targetElement = entry.target;
		if (targetElement.querySelectorAll("[data-fls-digcounter]").length && entry.isIntersecting) digitsCountersInit(targetElement.querySelectorAll("[data-fls-digcounter]"));
	}
	document.addEventListener("watcherCallback", digitsCounterAction);
}
document.querySelector("[data-fls-digcounter]") && window.addEventListener("load", digitsCounter);
//#endregion
