/* ==============================
   HEADER AO ROLAR
============================== */

const header =
  document.getElementById("header");

function updateHeader() {

  if (window.scrollY > 30) {

    header.classList.add("scrolled");

  } else {

    header.classList.remove("scrolled");

  }

}

window.addEventListener(
  "scroll",
  updateHeader
);

updateHeader();


/* ==============================
   ANIMAÇÕES AO ENTRAR NA TELA
============================== */

const revealElements =
  document.querySelectorAll(".reveal");


const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "visible"
          );

          observer.unobserve(
            entry.target
          );

        }

      });

    },

    {
      threshold: 0.12
    }

  );


revealElements.forEach(element => {

  observer.observe(element);

});


/* ==============================
   CARROSSEL
============================== */

const galleryViewport =
  document.getElementById(
    "galleryViewport"
  );


const galleryTrack =
  document.getElementById(
    "galleryTrack"
  );


const galleryCards =
  Array.from(
    document.querySelectorAll(
      ".gallery-card"
    )
  );


const galleryPrev =
  document.getElementById(
    "galleryPrev"
  );


const galleryNext =
  document.getElementById(
    "galleryNext"
  );


let galleryIndex = 0;


/* Quantas fotos ficam visíveis */

function getVisibleCards() {

  if (window.innerWidth <= 650) {
    return 1;
  }

  if (window.innerWidth <= 1050) {
    return 2;
  }

  return 3;

}


/* Maior posição possível */

function getMaxIndex() {

  return Math.max(
    0,
    galleryCards.length -
    getVisibleCards()
  );

}


/* Tamanho de deslocamento */

function getCardStep() {

  if (!galleryCards.length) {
    return 0;
  }

  const cardWidth =
    galleryCards[0]
      .getBoundingClientRect()
      .width;

  const gap = 14;

  return cardWidth + gap;

}


/* Atualizar posição */

function updateGallery(
  extraOffset = 0
) {

  galleryIndex =
    Math.max(
      0,
      Math.min(
        galleryIndex,
        getMaxIndex()
      )
    );

  const distance =
    galleryIndex *
    getCardStep();

  galleryTrack.style.transform =
    `translateX(${
      -distance + extraOffset
    }px)`;

}


/* Próxima */

function nextGallery() {

  const maxIndex =
    getMaxIndex();

  if (
    galleryIndex <
    maxIndex
  ) {

    galleryIndex++;

  } else {

    galleryIndex = 0;

  }

  updateGallery();

}


/* Anterior */

function previousGallery() {

  const maxIndex =
    getMaxIndex();

  if (
    galleryIndex > 0
  ) {

    galleryIndex--;

  } else {

    galleryIndex =
      maxIndex;

  }

  updateGallery();

}


galleryNext.addEventListener(
  "click",
  nextGallery
);


galleryPrev.addEventListener(
  "click",
  previousGallery
);


window.addEventListener(
  "resize",
  () => {

    galleryIndex =
      Math.min(
        galleryIndex,
        getMaxIndex()
      );

    updateGallery();

  }
);


/* ==============================
   ARRASTAR O CARROSSEL
============================== */

let isDragging = false;

let dragStartX = 0;

let dragOffset = 0;

let movedDuringDrag = false;


/* Mouse / touch começa */

function startDrag(clientX) {

  isDragging = true;

  movedDuringDrag = false;

  dragStartX = clientX;

  dragOffset = 0;

  galleryViewport.classList.add(
    "dragging"
  );

}


/* Movimento */

function drag(clientX) {

  if (!isDragging) {
    return;
  }

  dragOffset =
    clientX - dragStartX;

  if (
    Math.abs(dragOffset) > 5
  ) {

    movedDuringDrag = true;

  }

  updateGallery(
    dragOffset
  );

}


/* Soltar */

function endDrag() {

  if (!isDragging) {
    return;
  }

  galleryViewport.classList.remove(
    "dragging"
  );

  const threshold = 60;

  if (
    dragOffset < -threshold
  ) {

    galleryIndex =
      Math.min(
        galleryIndex + 1,
        getMaxIndex()
      );

  }

  if (
    dragOffset > threshold
  ) {

    galleryIndex =
      Math.max(
        galleryIndex - 1,
        0
      );

  }

  dragOffset = 0;

  isDragging = false;

  updateGallery();

}


/* Mouse */

galleryViewport.addEventListener(
  "mousedown",
  event => {

    startDrag(
      event.clientX
    );

  }
);


window.addEventListener(
  "mousemove",
  event => {

    drag(
      event.clientX
    );

  }
);


window.addEventListener(
  "mouseup",
  endDrag
);


/* Touch */

galleryViewport.addEventListener(
  "touchstart",
  event => {

    startDrag(
      event.touches[0]
        .clientX
    );

  },
  {
    passive: true
  }
);


galleryViewport.addEventListener(
  "touchmove",
  event => {

    drag(
      event.touches[0]
        .clientX
    );

  },
  {
    passive: true
  }
);


galleryViewport.addEventListener(
  "touchend",
  endDrag
);


/* ==============================
   LIGHTBOX
============================== */

const lightbox =
  document.getElementById(
    "lightbox"
  );


const lightboxImage =
  document.getElementById(
    "lightboxImage"
  );


const lightboxClose =
  document.getElementById(
    "lightboxClose"
  );


const lightboxPrev =
  document.getElementById(
    "lightboxPrev"
  );


const lightboxNext =
  document.getElementById(
    "lightboxNext"
  );


const lightboxBackdrop =
  document.getElementById(
    "lightboxBackdrop"
  );


const lightboxCounter =
  document.getElementById(
    "lightboxCounter"
  );


const galleryImages =
  galleryCards.map(
    card =>
      card.dataset.image
  );


let currentImageIndex = 0;


/* Atualizar lightbox */

function updateLightbox() {

  lightboxImage.src =
    galleryImages[
      currentImageIndex
    ];

  lightboxCounter.textContent =
    `${currentImageIndex + 1} / ${galleryImages.length}`;

}


/* Abrir */

function openLightbox(index) {

  currentImageIndex =
    index;

  updateLightbox();

  lightbox.classList.add(
    "active"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-open"
  );

}


/* Fechar */

function closeLightbox() {

  lightbox.classList.remove(
    "active"
  );

  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-open"
  );

}


/* Próxima */

function nextLightboxImage() {

  currentImageIndex =
    (
      currentImageIndex + 1
    ) %
    galleryImages.length;

  updateLightbox();

}


/* Anterior */

function previousLightboxImage() {

  currentImageIndex =
    (
      currentImageIndex -
      1 +
      galleryImages.length
    ) %
    galleryImages.length;

  updateLightbox();

}


/* Clique nas fotos */

galleryCards.forEach(
  (card, index) => {

    card.addEventListener(
      "click",
      event => {

        /*
          Evita abrir a foto
          quando o usuário
          estava apenas
          arrastando o carrossel.
        */

        if (movedDuringDrag) {

          event.preventDefault();

          movedDuringDrag =
            false;

          return;

        }

        openLightbox(
          index
        );

      }

    );

  }
);


/* Botões */

lightboxClose.addEventListener(
  "click",
  closeLightbox
);


lightboxBackdrop.addEventListener(
  "click",
  closeLightbox
);


lightboxNext.addEventListener(
  "click",
  nextLightboxImage
);


lightboxPrev.addEventListener(
  "click",
  previousLightboxImage
);


/* ==============================
   TECLADO
============================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      !lightbox.classList
        .contains("active")
    ) {

      return;

    }

    if (
      event.key ===
      "Escape"
    ) {

      closeLightbox();

    }


    if (
      event.key ===
      "ArrowRight"
    ) {

      nextLightboxImage();

    }


    if (
      event.key ===
      "ArrowLeft"
    ) {

      previousLightboxImage();

    }

  }
);


/* ==============================
   INICIALIZAÇÃO
============================== */

updateGallery();