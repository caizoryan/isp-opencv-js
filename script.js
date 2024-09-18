let imgElement = document.getElementById("imageSrc")
let inputElement = document.getElementById("fileInput");
let templateElement = document.getElementById("templateInput");
let outputElement = document.getElementById("outputCanvas");
let slider1 = document.getElementById("inputRange1");
let slider2 = document.getElementById("inputRange2");

let src = cv.imread(imgElement);
let dst = new cv.Mat();


(async () => {
  const worker = await Tesseract.createWorker('eng');

  time = Date.now();

  while (true) {
    let newret = await worker.recognize('./test3.png');

    console.log(newret.data.text);

    let confident = []

    newret.data.words.forEach((word, i) => {
      let confidence = word.confidence;
      if (confidence > 60) {
        confident.push(word.text);
      }
    });

    console.log('confident words', confident.join(' '));
  }
})();

inputElement.addEventListener("change", (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);


let matchTemplate = (soorc, templ) => {
  let mask = new cv.Mat();


  cv.matchTemplate(soorc, templ, dst, cv.TM_SQDIFF_NORMED, mask);

  let result = cv.minMaxLoc(dst, mask);
  let maxPoint = result.maxLoc;
  let color = new cv.Scalar(255, 0, 0, 255);
  let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);

  cv.rectangle(soorc, maxPoint, point, color, 2, cv.LINE_8, 0);
  cv.imshow('outputCanvas', soorc);

  templ.delete();
  soorc.delete();
  mask.delete();
}

templateElement.addEventListener("change", (e) => {
  let l = new Image();
  l.src = URL.createObjectURL(e.target.files[0]);

  l.onload = function() {
    let templ = cv.imread(l);
    let soorc = cv.imread(imgElement);

    matchTemplate(soorc, templ);
  }
})

let sliderValue = () => {
  let val1 = parseFloat(slider1.value)
  let val2 = parseFloat(slider2.value)

  return [val1, val2]
}

let sliderEvent = () => {
  let [val1, val2] = sliderValue();
  operation(val1, val2);
}
slider1.addEventListener("change", sliderEvent)
slider2.addEventListener("change", sliderEvent)


imgElement.onload = function() {
  let mat = cv.imread(imgElement);
  src = cv.imread(imgElement);
  cv.imshow("outputCanvas", mat);
}
cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);

let threshold = (val1, val2) => {
  cv.threshold(src, dst, val1, val2, cv.THRESH_BINARY);
  cv.imshow("outputCanvas", dst);
}

let cannyedges = (val1, val2) => {
  let temp = new cv.Mat();
  cv.cvtColor(src, temp, cv.COLOR_RGB2GRAY, 0);
  cv.Canny(temp, dst, val1, val2, 3, false);
  cv.imshow("outputCanvas", dst);

  temp.delete();
}

let grayscale = () => {
  cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY, 0);
  cv.imshow("outputCanvas", dst);
}

let refresh = () => {
  src = cv.imread(imgElement);
  cv.imshow("outputCanvas", src);
}

let img_src = "./series/img_6.PNG"
let template_src = "./series/temp.jpeg"

let loadImages = () => {
  let s = new Image();
  s.src = img_src;

  let t = new Image();
  t.src = template_src;

  s.onload = function() {
    let soorc = cv.imread(s);
    cv.imshow("outputCanvas", soorc);

    let templ = cv.imread(t);
    matchTemplate(soorc, templ);

  }

  t.onload = function() {
    let templ = cv.imread(t);
    cv.imshow("outputCanvas", templ);
  }
}

loadImages();

let operation = cannyedges;

