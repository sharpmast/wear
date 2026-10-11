"use strict";

const menuBtn = document.querySelector(".menu__icon");
const mobMenu = document.querySelector(".menu");
const overlay = document.querySelector(".overlay");
const wrapper = document.querySelector(".wrapper");


// 1. Клік по кнопці — відкриває/закриває меню
menuBtn.addEventListener("click", () => {
  menuBtn.classList.toggle("menu__icon--active");
  mobMenu.classList.toggle("menu--active");
  overlay.classList.toggle("overlay--active");
  wrapper.classList.toggle("wrapper--active");
   priceNavigation.classList.remove("price__navigation--active");
  priceBtn.classList.remove("button-price--active");
});

document.addEventListener("click", (event) => {
  const isMenuOpen = mobMenu.classList.contains("menu--active");
  
  const clickedOutsideMenu = !mobMenu.contains(event.target);
  const clickedOutsideBtn = !menuBtn.contains(event.target);

  if (isMenuOpen && clickedOutsideMenu && clickedOutsideBtn) {
    menuBtn.classList.remove("menu__icon--active");
    mobMenu.classList.remove("menu--active");
    overlay.classList.remove("overlay--active");
    wrapper.classList.remove("wrapper--active");
  }
});

const navLinks = document.querySelectorAll(".menu__link"); 

navLinks.forEach((item) => {
  item.addEventListener("click", function (e) {
    const href = item.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault(); 

      // Закриваємо мобільне меню
      menuBtn.classList.remove("menu__icon--active");
      mobMenu.classList.remove("menu--active");
      overlay.classList.remove("overlay--active");
      wrapper.classList.remove("wrapper--active");

      const blockId = href.substring(1);
      const targetBlock = document.getElementById(blockId);

      if (targetBlock) {
        targetBlock.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});



function DynamicAdapt(type) {
  this.type = type;
}

DynamicAdapt.prototype.init = function () {
  const _this = this;
  // массив объектов
  this.оbjects = [];
  this.daClassname = "_dynamic_adapt_";
  // массив DOM-элементов
  this.nodes = document.querySelectorAll("[data-da]");

  // наполнение оbjects объктами
  for (let i = 0; i < this.nodes.length; i++) {
    const node = this.nodes[i];
    const data = node.dataset.da.trim();
    const dataArray = data.split(",");
    const оbject = {};
    оbject.element = node;
    оbject.parent = node.parentNode;
    оbject.destination = document.querySelector(dataArray[0].trim());
    оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
    оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
    оbject.index = this.indexInParent(оbject.parent, оbject.element);
    this.оbjects.push(оbject);
  }

  this.arraySort(this.оbjects);

  // массив уникальных медиа-запросов
  this.mediaQueries = Array.prototype.map.call(
    this.оbjects,
    function (item) {
      return (
        "(" +
        this.type +
        "-width: " +
        item.breakpoint +
        "px)," +
        item.breakpoint
      );
    },
    this,
  );
  this.mediaQueries = Array.prototype.filter.call(
    this.mediaQueries,
    function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    },
  );

  // навешивание слушателя на медиа-запрос
  // и вызов обработчика при первом запуске
  for (let i = 0; i < this.mediaQueries.length; i++) {
    const media = this.mediaQueries[i];
    const mediaSplit = String.prototype.split.call(media, ",");
    const matchMedia = window.matchMedia(mediaSplit[0]);
    const mediaBreakpoint = mediaSplit[1];

    // массив объектов с подходящим брейкпоинтом
    const оbjectsFilter = Array.prototype.filter.call(
      this.оbjects,
      function (item) {
        return item.breakpoint === mediaBreakpoint;
      },
    );
    matchMedia.addListener(function () {
      _this.mediaHandler(matchMedia, оbjectsFilter);
    });
    this.mediaHandler(matchMedia, оbjectsFilter);
  }
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
  if (matchMedia.matches) {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.moveTo(оbject.place, оbject.element, оbject.destination);
    }
  } else {
    for (let i = 0; i < оbjects.length; i++) {
      const оbject = оbjects[i];
      if (оbject.element.classList.contains(this.daClassname)) {
        this.moveBack(оbject.parent, оbject.element, оbject.index);
      }
    }
  }
};

DynamicAdapt.prototype.moveTo = function (place, element, destination) {
  element.classList.add(this.daClassname);
  if (place === "last" || place >= destination.children.length) {
    destination.insertAdjacentElement("beforeend", element);
    return;
  }
  if (place === "first") {
    destination.insertAdjacentElement("afterbegin", element);
    return;
  }
  destination.children[place].insertAdjacentElement("beforebegin", element);
};

DynamicAdapt.prototype.moveBack = function (parent, element, index) {
  element.classList.remove(this.daClassname);
  if (parent.children[index] !== undefined) {
    parent.children[index].insertAdjacentElement("beforebegin", element);
  } else {
    parent.insertAdjacentElement("beforeend", element);
  }
};


DynamicAdapt.prototype.indexInParent = function (parent, element) {
  const array = Array.prototype.slice.call(parent.children);
  return Array.prototype.indexOf.call(array, element);
};

DynamicAdapt.prototype.arraySort = function (arr) {
  if (this.type === "min") {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return -1;
        }

        if (a.place === "last" || b.place === "first") {
          return 1;
        }

        return a.place - b.place;
      }

      return a.breakpoint - b.breakpoint;
    });
  } else {
    Array.prototype.sort.call(arr, function (a, b) {
      if (a.breakpoint === b.breakpoint) {
        if (a.place === b.place) {
          return 0;
        }

        if (a.place === "first" || b.place === "last") {
          return 1;
        }

        if (a.place === "last" || b.place === "first") {
          return -1;
        }

        return b.place - a.place;
      }

      return b.breakpoint - a.breakpoint;
    });
    return;
  }
};

const da = new DynamicAdapt("max");
da.init();

const viberBtn = document.getElementById('viberBtn');
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

viberBtn.href = isMobile
    ? "viber://chat?number=%2B380936004875"
    : "https://invite.viber.com/?number=%2B380936004875";

viberBtn.target = "_blank";


const modal = document.getElementById('modal');

const buttons = document.querySelectorAll('.open-modal');

const closeModal = document.getElementById('closeModal');

buttons.forEach(button => {

    button.addEventListener('click', () => {

        modal.classList.add('modal--active');
    });

});

closeModal.addEventListener('click', () => {
    modal.classList.remove('modal--active');
});

document.addEventListener("click", async function (e) {
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
                document.getElementById("modal").classList.remove('modal--active');
            }, 3000);

        } catch {
            status.innerText = "❌ Помилка!";
            status.style.color = "red";
        }
    }
});

const priceBtn = document.querySelector(".button-price");
const priceNavigation = document.querySelector(".price__navigation");

if (priceBtn && priceNavigation) {

  priceBtn.addEventListener("click", (event) => {
    event.stopPropagation();

    priceNavigation.classList.toggle("price__navigation--active");
    priceBtn.classList.toggle("button-price--active");

    if (menuBtn) {
      menuBtn.classList.toggle("menu__icon--active");
      menuBtn.classList.remove("menu__icon--active");
    }

    if (mobMenu) {
      mobMenu.classList.remove("menu--active");
    }

    if (overlay) {
      overlay.classList.remove("overlay--active");
    }

    if (wrapper) {
      wrapper.classList.remove("wrapper--active");
    }
  });


  document.addEventListener("click", () => {
    const isPriceOpen = priceNavigation.classList.contains("price__navigation--active");

    if (isPriceOpen) {
      priceNavigation.classList.remove("price__navigation--active");
      priceBtn.classList.remove("button-price--active");
    }
  });

}



const items = document.querySelectorAll('.anim');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

items.forEach(item => observer.observe(item));


const cards = document.querySelectorAll('.card');

const obser = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

cards.forEach(card => obser.observe(card));