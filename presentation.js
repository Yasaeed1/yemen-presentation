const slides = [
  ["مقدمة العرض", "غلاف العرض، يجمع رسم سد مأرب ومئذنة وشجرة دم الأخوين لتمثيل محاور التراث الثلاثة."],
  ["خريطة المعالم الثلاثة", "خريطة تحدد مواقع مأرب وزبيد وسقطرى، وجدول يقارن بين طبيعة إرث كل موقع وحقبته."],
  ["سد مأرب", "رسم هندسي يوضح شكل سد مأرب القديم وأبعاده، ويشير إلى البلق الشمالي والجنوبي."],
  ["أبواب زبيد", "مخطط دائري يوضح مواقع أبواب زبيد واتجاهاتها حول المدينة التاريخية."],
  ["زبيد والتراث العلمي", "أرقام عن مؤسسات زبيد التعليمية والثقافية، مع أبرز المساجد والمدارس وإشارات إلى ابن بطوطة والفيروز آبادي."],
  ["سقطرى عبر الزمن", "خريطة للأرخبيل وخط زمني يعرض مراحل من تاريخه من العصور القديمة إلى العصر الحاضر."],
  ["التنوع الحيوي في سقطرى", "رسم لشجرة دم الأخوين وملخص عن النباتات والطيور والحياة البحرية في الأرخبيل."],
  ["تضاريس سقطرى", "مقطع بصري ينتقل من الشواطئ إلى السهول والأودية ثم المرتفعات والجبال."],
  ["كهف حوق", "صورة من داخل كهف حوق، مع شرح للنقوش والآثار التي تربط الكهف بالملاحة والتجارة القديمة."],
  ["الخلاصة", "مثلث يصل بين إرث مأرب الهندسي، وإرث زبيد الفكري، والتنوع الطبيعي في سقطرى."],
];

const arabicNumber = new Intl.NumberFormat("ar-SA-u-nu-arab");
const image = document.querySelector("#slide");
const topic = document.querySelector("#topic");
const slideList = document.querySelector("#slide-list");
const position = document.querySelector("#position");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const zoom = document.querySelector("#zoom");
const dialog = document.querySelector("#zoom-dialog");
const fit = document.querySelector("#fit");
const zoomViewport = document.querySelector("#zoom-viewport");
const largeSlide = document.querySelector("#large-slide");
let current = 0;

function slideHash(index) {
  return "#slide-" + (index + 1);
}

function imagePath(index) {
  return "slides/slide-" + String(index + 1).padStart(2, "0") + ".webp";
}

const slideLinks = slides.map(([title], index) => {
  const item = document.createElement("li");
  const link = document.createElement("a");
  const number = document.createElement("span");
  number.className = "index-number";
  number.setAttribute("aria-hidden", "true");
  number.textContent = arabicNumber.format(index + 1);
  link.href = slideHash(index);
  link.append(number, title);
  item.append(link);
  slideList.append(item);
  return link;
});

function showSlide(index) {
  current = index;
  const [title, description] = slides[index];
  const path = imagePath(index);
  if (image.getAttribute("src") !== path) image.src = path;
  image.alt = description;
  topic.textContent = title;
  position.textContent = arabicNumber.format(index + 1) + " من " + arabicNumber.format(slides.length);
  previous.disabled = index === 0;
  next.disabled = index === slides.length - 1;
  slideLinks.forEach((link, i) => {
    if (i === index) link.setAttribute("aria-current", "step");
    else link.removeAttribute("aria-current");
  });
}

function readHash() {
  const match = /^#slide-([1-9]\d*)$/.exec(location.hash);
  const index = match ? Number(match[1]) - 1 : 0;
  showSlide(index < slides.length ? index : 0);
}

function moveBy(offset) {
  const target = current + offset;
  if (target >= 0 && target < slides.length) location.hash = slideHash(target);
}

previous.addEventListener("click", () => moveBy(-1));
next.addEventListener("click", () => moveBy(1));
window.addEventListener("hashchange", readHash);
document.addEventListener("keydown", (event) => {
  if (dialog.open || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  event.preventDefault();
  moveBy(event.key === "ArrowLeft" ? 1 : -1);
});

function setFit(fitted) {
  fit.setAttribute("aria-pressed", String(fitted));
  fit.textContent = fitted ? "الحجم الكامل" : "ملاءمة الشاشة";
  zoomViewport.classList.toggle("fit", fitted);
}

if (typeof dialog.showModal === "function") {
  zoom.hidden = false;
  zoom.addEventListener("click", () => {
    largeSlide.src = imagePath(current);
    largeSlide.alt = slides[current][1];
    setFit(false);
    dialog.showModal();
    zoomViewport.scrollTo(0, 0);
    zoomViewport.focus();
  });
  fit.addEventListener("click", () => setFit(fit.getAttribute("aria-pressed") === "false"));
  dialog.addEventListener("close", () => zoom.focus());
}

readHash();
document.querySelector("#controls").hidden = false;
document.querySelector("#outline").hidden = false;
