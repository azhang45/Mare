const img = document.getElementById('');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

img.onload = function () {
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // Code comes here
  
    for (i = 0; i < imgData.data.length; i += 4) { // i adds four because data returns rgba values - only want the a values
        let count = imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2];
        let finalColor = 0;

        if (count > 450) {
            finalColor = 255;
        }

        imgData.data[i] = finalColor;
        imgData.data[i + 1] = finalColor;
        imgData.data[i + 2] = finalColor;
        imgData.data[i + 3] = 255;
  }
};

