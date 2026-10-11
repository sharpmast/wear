import { a as slideDown, i as setHash, o as slideUp, r as getHash, t as dataMediaQueries } from "./app.min.js";
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
var services = {
	kuskachky: {
		type: "length",
		brand: "Заточування інструменту",
		title: "Кусачки для кутикули",
		image: "assets/img/service/kuskut-.jpg",
		description: "Професійне заточування кусачок для кутикули будь-якої складності.",
		prices: [
			{
				name: "до 10мм",
				price: 170
			},
			{
				name: "10 - 15мм",
				price: 190
			},
			{
				name: "15 - 20мм",
				price: 210
			}
		]
	},
	kusnog: {
		type: "length",
		brand: "Заточування інструменту",
		title: "Кусачки для нігтів",
		image: "assets/img/service/staleks.webp",
		description: "Професійне заточування кусачок для нігтів будь-якої складності.",
		prices: [
			{
				name: "до 10мм",
				price: 140
			},
			{
				name: "10 - 15мм",
				price: 170
			},
			{
				name: "15 - 20мм",
				price: 190
			}
		]
	},
	nosznizy: {
		type: "fixed",
		brand: "Заточування інструменту",
		title: "Ножнички для нігтів",
		image: "assets/img/service/scissor3.webp",
		description: "Професійне заточування ножничок для нігтів будь-якої складності",
		price: 140
	},
	noszkut: {
		type: "fixed",
		brand: "Заточування інструменту",
		title: "Ножнички для кутикули",
		image: "assets/img/service/Scissors.webp",
		description: "Професійне заточування ножничок для кутикули будь-якої складності",
		price: 170
	},
	pusher: {
		type: "fixed",
		brand: "Заточування інструменту",
		title: "Пушер",
		image: "assets/img/service/pusher.webp",
		description: "Професійне заточування пушерів, вирівнювання робочих поверхонь, індивідуальний підхід",
		price: 120
	},
	pincet: {
		type: "fixed",
		brand: "Заточування інструменту",
		title: "Пінцет",
		image: "assets/img/service/pincet.webp",
		description: "Професійне заточування пінцетів, вирівнювання робочих поверхонь, індивідуальний підхід",
		price: 120
	},
	homeScissors: {
		type: "fixed",
		brand: "Заточування інструменту",
		title: "Домашні ножиці",
		image: "assets/img/service/homeSci.webp",
		description: "Заточування домашніх(побутових) ножиць",
		price: 120
	},
	portnovskie: {
		type: "multiple",
		sections: [{
			brand: "Заточування інструменту",
			title: "Великі кравецькі ножиці",
			image: "assets/img/service/rew3.webp",
			description: "Професійне заточування кравецьких ножиць.",
			price: 200
		}, {
			brand: "Заточування інструменту",
			title: "Маленькі кравецькі ножиці",
			image: "assets/img/service/port2.webp",
			description: "Професійне заточування кравецьких ножиць.",
			price: 140
		}]
	},
	knifes: {
		type: "multiple-length",
		sections: [{
			brand: "Заточування інструменту",
			title: "Ножі кухонні",
			image: "assets/img/service/knifes.jfif",
			description: "Професійне заточування кухонних ножів",
			prices: [
				{
					name: "до 10см",
					price: 140
				},
				{
					name: "10 - 15см",
					price: 160
				},
				{
					name: "15 - 30см",
					price: 190
				}
			]
		}, {
			brand: "Заточування інструменту",
			title: "Ножі мисливські",
			image: "assets/img/service/knife2.webp",
			description: "Професійне заточування мисливських ножів",
			prices: [
				{
					name: "до 10см",
					price: 170
				},
				{
					name: "10 - 15см",
					price: 210
				},
				{
					name: "15 - 30см",
					price: 270
				}
			]
		}]
	},
	parikmakherskie: {
		type: "multiple-length",
		sections: [
			{
				brand: "Заточування інструменту",
				title: "Прямі перукарські ножиці",
				image: "assets/img//service/parik1.webp",
				description: "Професійне заточування прямих перукарських ножиць.",
				prices: [
					{
						name: "Заточування",
						price: 220
					},
					{
						name: "Заточування + шайба",
						price: 270
					},
					{
						name: "Заточування + бампер",
						price: 280
					}
				]
			},
			{
				brand: "Заточування інструменту",
				title: "Філірувальні перукарські ножиці",
				image: "assets/img/service/parik2.webp",
				description: "Професійне заточування філірувальних перукарських ножиць.",
				prices: [
					{
						name: "Заточування",
						price: 250
					},
					{
						name: "Заточування + шайба",
						price: 310
					},
					{
						name: "Заточування + бампер",
						price: 320
					}
				]
			},
			{
				brand: "Заточування інструменту",
				title: "Слайсингові перукарські ножиці",
				image: "assets/img/service/parik3.webp",
				description: "Професійне заточування слайсингових ножиць.",
				prices: [
					{
						name: "Заточування",
						price: 270
					},
					{
						name: "Заточування + шайба",
						price: 330
					},
					{
						name: "Заточування + бампер",
						price: 340
					}
				]
			},
			{
				brand: "Заточування інструменту",
				title: "Грумерські ножиці",
				image: "assets/img/service/grum1.webp",
				description: "Професійне заточування грумерських ножиць.",
				prices: [
					{
						name: "Заточування",
						price: 270
					},
					{
						name: "Заточування + шайба",
						price: 330
					},
					{
						name: "Заточування + бампер",
						price: 340
					}
				]
			},
			{
				brand: "Заточування інструменту",
				title: "Грумерські філірувальні ножиці",
				image: "assets/img/service/grum2.webp",
				description: "Професійне заточування грумерських ножиць.",
				prices: [
					{
						name: "Заточування",
						price: 290
					},
					{
						name: "Заточування + шайба",
						price: 350
					},
					{
						name: "Заточування + бампер",
						price: 360
					}
				]
			}
		]
	},
	controlUnit: {
		type: "multiple",
		sections: [
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Профілактика та чистка від пилу",
				image: "assets/img/repair/brush.png",
				description: "Профілактичне обслуговування блоку керування та очищення внутрішніх компонентів від пилу.",
				price: 150
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна транзистора",
				image: "assets/img/repair/bdw1.jpg",
				description: "Заміна несправного транзистора для відновлення працездатності блоку керування.",
				price: 350
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна регулятора обертів",
				image: "assets/img/repair/b10k.jpg",
				description: "Заміна несправного регулятора обертів для стабільного керування швидкістю фрезера.",
				price: 250
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна трансформатора",
				image: "assets/img/repair/trans.jfif",
				description: "Заміна несправного трансформатора блоку керування.",
				price: 1650
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна роз’єму",
				image: "assets/img/repair/5din.jpg",
				description: "Заміна пошкодженого роз’єму підключення.",
				price: 350
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна кабелю живлення",
				image: "assets/img/repair/electro1.webp",
				description: "Заміна пошкодженого кабелю живлення блоку керування.",
				price: 350
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна кнопок",
				image: "assets/img/repair/but1.jpg",
				description: "Заміна несправних кнопок увімкнення та керування обладнанням.",
				price: 350
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Інші ремонтні роботи",
				image: "assets/img/repair/brake.png",
				description: "Інші види ремонту та заміна зношених компонентів. Перелік робіт і вартість узгоджуються індивідуально.",
				price: null
			}
		]
	},
	extractor: {
		type: "multiple",
		sections: [
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна кнопки",
				image: "assets/img/repair/but2.webp",
				description: "Заміна несправної кнопки ввімкнення та вимкнення манікюрної витяжки.",
				price: 250
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна роз’єму",
				image: "assets/img/repair/g34.jpg",
				description: "Заміна пошкодженого роз’єму живлення для надійного підключення обладнання.",
				price: 250
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна блоку живлення",
				image: "assets/img/repair/block-m.jpg",
				description: "Заміна несправного блоку живлення для відновлення стабільної роботи витяжки.",
				price: 800
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна кабелю живлення",
				image: "assets/img/repair/electro1.webp",
				description: "Заміна пошкодженого кабелю живлення з перевіркою надійності підключення.",
				price: 350
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Інші ремонтні роботи",
				image: "assets/img/repair/brake.png",
				description: "Діагностика та усунення інших несправностей манікюрної витяжки. Вартість залежить від складності ремонту.",
				price: 0
			}
		]
	},
	handPiece: {
		type: "multiple-length",
		sections: [
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Профілактика ручки фрезера",
				image: "assets/img/repair/brush.png",
				description: "Розбирання ручки фрезера, очищення внутрішніх механізмів від пилу, перевірка стану деталей та працездатності.",
				prices: [{
					name: "Профілактика",
					price: 350
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Складна профілактика ручки фрезера",
				image: "assets/img/repair/hand2.jfif",
				description: "Розбирання ручки фрезера, очищення від пилу дуже брудної ручки, очищення від іржі поліровка ротора, перевірка стану деталей та працездатності.",
				prices: [{
					name: "Профілактика",
					price: 450
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна цанги",
				image: "assets/img/repair/zanga.webp",
				description: "Заміна зношеної або пошкодженої цанги для надійної фіксації фрези та стабільної роботи ручки. Ціна за заміну, вартість деталі залежить від моделі ручки",
				prices: [{
					name: "Заміна цанги",
					price: 150
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна підшипників",
				image: "assets/img/repair/nsk.webp",
				description: "Заміна підшипників, кількість залежить від конструкції ручки та ступеня їхнього зношення.",
				prices: [{
					name: "Заміна 1 підшипника",
					price: 150
				}, {
					name: "Заміна 2 і більше підшипників",
					price: 200
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна ротора",
				image: "assets/img/repair/Price-rotor.webp",
				description: "Заміна пошкодженого або зношеного ротора двигуна ручки фрезера для відновлення її працездатності.",
				prices: [{
					name: "Заміна ротора",
					price: 1100
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна шнура",
				image: "assets/img/repair/kabel.webp",
				description: "Заміна пошкодженого кабелю ручки фрезера для відновлення надійного електричного з’єднання.",
				prices: [{
					name: "Заміна шнура",
					price: 450
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна щіток",
				image: "assets/img/repair/brashes.webp",
				description: "Заміна зношених щіток двигуна, якщо конструкція ручки передбачає їх використання.",
				prices: [{
					name: "Заміна щіток",
					price: 350
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна шайбочок",
				image: "assets/img/repair/Price-zanga.webp",
				description: "Заміна зношених або пошкоджених шайбочок та роликв у механізмі ручки фрезера для належної роботи та складання вузла.",
				prices: [{
					name: "Заміна шайбочки",
					price: 70
				}, {
					name: "Заміна роликів",
					price: 220
				}]
			},
			{
				brand: "Ремонт манікюрного обладнання",
				title: "Заміна інших зношених деталей",
				image: "assets/img/repair/brake.png",
				description: "Вартість: залежить від типу несправності, вартості комплектуючих і складності ремонту. Остаточна ціна узгоджується після діагностики.",
				prices: [{
					name: "Договірна",
					price: ""
				}]
			}
		]
	}
};
var serviceName = new URLSearchParams(window.location.search).get("service");
var service = services[serviceName];
if (!service) console.error("Послугу не знайдено:", serviceName);
else if (service.type === "multiple" || service.type === "multiple-length") {
	const originalBlock = document.querySelector(".card-product");
	if (originalBlock) {
		const parent = originalBlock.parentElement;
		service.sections.forEach((item, index) => {
			let block;
			if (index === 0) block = originalBlock;
			else {
				block = originalBlock.cloneNode(true);
				parent.appendChild(block);
			}
			const image = block.querySelector("[data-service-image]")?.querySelector("img");
			if (image) {
				image.src = item.image;
				image.alt = item.title;
			}
			const brand = block.querySelector("[data-service-brand]");
			if (brand) brand.textContent = item.brand;
			const title = block.querySelector("[data-service-title]");
			if (title) title.textContent = item.title;
			const description = block.querySelector("[data-service-description]");
			if (description) description.textContent = item.description;
			const currentPrice = block.querySelector("[data-size-title]");
			if (service.type === "multiple") {
				if (currentPrice) currentPrice.textContent = item.price;
				const pricesContainer = block.querySelector("[data-service-prices]");
				if (pricesContainer) pricesContainer.remove();
			}
			if (service.type === "multiple-length") {
				const pricesContainer = block.querySelector("[data-service-prices]");
				if (pricesContainer) {
					pricesContainer.innerHTML = "";
					item.prices.forEach((priceItem, priceIndex) => {
						const button = document.createElement("button");
						button.type = "button";
						button.className = "card-product__size-btn";
						button.dataset.value = priceItem.price;
						button.innerHTML = `
                                <span>
                                    ${priceItem.name}
                                </span>
                            `;
						if (priceIndex === 0) {
							button.classList.add("active");
							if (currentPrice) currentPrice.textContent = priceItem.price;
						}
						button.addEventListener("click", () => {
							pricesContainer.querySelectorAll(".card-product__size-btn").forEach((btn) => {
								btn.classList.remove("active");
							});
							button.classList.add("active");
							if (currentPrice) currentPrice.textContent = priceItem.price;
						});
						pricesContainer.appendChild(button);
					});
				}
			}
		});
	}
} else {
	const image = document.querySelector("[data-service-image]")?.querySelector("img");
	if (image) {
		image.src = service.image;
		image.alt = service.title;
	}
	const brand = document.querySelector("[data-service-brand]");
	if (brand) brand.textContent = service.brand;
	const title = document.querySelector("[data-service-title]");
	if (title) title.textContent = service.title;
	const description = document.querySelector("[data-service-description]");
	if (description) description.textContent = service.description;
	const currentPrice = document.querySelector("[data-size-title]");
	const pricesContainer = document.querySelector("[data-service-prices]");
	if (service.type === "length") {
		if (pricesContainer) {
			pricesContainer.innerHTML = "";
			service.prices.forEach((item, index) => {
				const button = document.createElement("button");
				button.className = "card-product__size-btn";
				button.dataset.value = item.price;
				button.innerHTML = `
                        <span>${item.name}</span>
                    `;
				if (index === 0) {
					button.classList.add("active");
					if (currentPrice) currentPrice.textContent = item.price;
				}
				button.addEventListener("click", () => {
					pricesContainer.querySelectorAll(".card-product__size-btn").forEach((btn) => {
						btn.classList.remove("active");
					});
					button.classList.add("active");
					if (currentPrice) currentPrice.textContent = item.price;
				});
				pricesContainer.appendChild(button);
			});
		}
	}
	if (service.type === "fixed") {
		if (currentPrice) currentPrice.textContent = service.price;
		if (pricesContainer) pricesContainer.remove();
	}
}
//#endregion
