
let imgElement = document.getElementById("imageSrc")
let inputElement = document.getElementById("fileInput");
let templateElement = document.getElementById("templateInput");
let outputElement = document.getElementById("outputCanvas");
let slider1 = document.getElementById("inputRange1");
let slider2 = document.getElementById("inputRange2");

let displayCanvas = document.getElementById("displayCanvas");
let videoCanvas = document.getElementById("videoCanvas");

let words = []

let display = (p) => {
  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight / 2);
    p.frameRate(1);
  }

  p.draw = () => {
    p.background(255, 255, 255, 150);
    p.textSize(90);
    p.text(words.join(' '), 509, 300);
  }
}
let vid = (p) => {
  let capture;
  p.setup = () => {
    p.createCanvas(640, 480);
    p.background(255);
    p.frameRate(3);
    capture = p.createCapture(p.VIDEO);
    capture.hide()
  }

  p.draw = () => {
    p.background(255);
    p.image(capture, 0, 0, 640, 480);
  }
}

let sketch = new p5(vid, videoCanvas);
// videoCanvas.style.display = "none";

let otherSketch = new p5(display, displayCanvas);

// let src = cv.imread(imgElement);
// let dst = new cv.Mat();
// let file = ""

// TESsERACT STUFF
(async () => {
  const worker = await Tesseract.createWorker('eng');

  time = Date.now();

  while (true) {
    // let newret = await worker.recognize('./test3.png');
    let image = document.getElementById("defaultCanvas0");

    let thresholded = cv.imread(image);
    cv.cvtColor(thresholded, thresholded, cv.COLOR_BGR2GRAY)


    let M = cv.Mat.ones(5, 5, cv.CV_8U);
    let anchor = new cv.Point(-1, -1);
    // You can try more different parameters
    cv.dilate(thresholded, thresholded, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
    cv.erode(thresholded, thresholded, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

    let c = document.createElement("canvas");
    c.id = "outputCanvas1";
    cv.imshow(c, thresholded);
    cv.imshow("defaultCanvas0", thresholded);
    let img = c.toDataURL();
    //
    // let img = image.toDataURL();

    let newret = await worker.recognize(img);

    console.log(newret.data.text);

    let confident = []

    newret.data.words.forEach((word, i) => {
      let confidence = word.confidence;
      if (confidence > 60) {
        confident.push(word.text);
      }
    });

    words = confident;

    console.log('confident words', confident.join(' '));
  }
})();

// inputElement.addEventListener("change", (e) => {
//   imgElement.src = URL.createObjectURL(e.target.files[0]);
// }, false);


// OPEN CV STuff
let sliderValue = () => {
  let val1 = parseFloat(slider1.value)
  let val2 = parseFloat(slider2.value)

  return [val1, val2]
}

let sliderEvent = () => {
  let [val1, val2] = sliderValue();
  operation(val1, val2);
}

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

let operation = cannyedges;

