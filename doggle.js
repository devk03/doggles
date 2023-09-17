function linkToPixels(link) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const pixels = ctx.getImageData(0, 0, img.width, img.height);
      resolve(pixels);
    };
    img.onerror = reject;
    img.src = link;
  });
}
// Copyright 2019 by András Péter
// Licensed under the GNU General Public License v3: http://www.gnu.org/licenses/gpl.html

function imgprocess(
  pixels,
  deuter,
  decbright,
  decac
) {
  starttime = new Date().getTime();
  var // Width of image
    imgWidth = pixels.width,
    imgHeight = pixels.height,
    data = new Array((imgWidth * imgHeight) << 2),
    tdata = new Array((imgWidth * imgHeight) << 2),
    r = 0,
    redtemp = (greentemp = bluetemp = 0),
    brighto = 0,
    brightc = 0,
    gc = 1 / 2.2,
    brl = (brhh = 0),
    imgWF = imgWidth * 4;
  if (deuter) {
    for (var i = 0; i < imgWidth; i++) {
      for (var j = 0; j < imgHeight; j++) {
        redtemp += tdata[r] = Math.pow(pixels.data[r], 2.2);
        r++;
        greentemp += tdata[r] = Math.pow(pixels.data[r], 2.2);
        r++;
        bluetemp += tdata[r] = Math.pow(pixels.data[r], 2.2);
        r -= 2;
        tdata[r + 1] = (tdata[r] + tdata[r + 1]) * 0.5;
        r += 4;
      }
    }
    redtemp = redtemp / (imgWidth * imgHeight);
    greentemp = greentemp / (imgWidth * imgHeight);
    bluetemp = bluetemp / (imgWidth * imgHeight);
    brighto = redtemp * 0.3 + greentemp * 0.59 + bluetemp * 0.11;
    brightc =
      brighto /
      (redtemp * 0.3 + (redtemp + greentemp) * 0.5 * 0.59 + bluetemp * 0.11);
    for (var brad = 1; brad < decac; brad++) {
      var // Value for dividing summed pixel values of the averaging window
        bradvtrec = 1 / (brad * 4),
        imgWmb = imgWidth - brad,
        imgHmb = imgHeight - brad;
      r = 1;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          data[r] = tdata[r];
          r++;
          data[r] = tdata[r];
          r += 3;
        }
      }
      for (var i = 0; i < imgWidth; i++) {
        brl = brhh = (i << 2) + 1;
        greentemp = data[brl] * (brad + brad + 1);
        bluetemp = data[brl + 1] * (brad + brad + 1);
        for (var bj = 1; bj < brad; bj++) {
          if (bj < imgHeight - 1) {
            brhh += imgWF;
          }
          greentemp += data[brhh] + data[brhh];
          bluetemp += data[brhh + 1] + data[brhh + 1];
        }
        if (brad < imgHeight - 1) {
          brhh += imgWF;
        }
        greentemp += data[brhh];
        bluetemp += data[brhh + 1];
        r = (i << 2) + 1;
        tdata[r] = greentemp * bradvtrec;
        tdata[r + 1] = bluetemp * bradvtrec;
        for (var j = 1; j < imgHeight; j++) {
          greentemp -= data[brl];
          bluetemp -= data[brl + 1];
          if (j > brad) {
            brl += imgWF;
          }
          greentemp -= data[brl];
          bluetemp -= data[brl + 1];
          greentemp += data[brhh];
          bluetemp += data[brhh + 1];
          if (j < imgHmb) {
            brhh += imgWF;
          }
          greentemp += data[brhh];
          bluetemp += data[brhh + 1];
          r += imgWF;
          tdata[r] = greentemp * bradvtrec;
          tdata[r + 1] = bluetemp * bradvtrec;
        }
      }
      r = 1;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          data[r] = tdata[r];
          r++;
          data[r] = tdata[r];
          r += 3;
        }
      }
      for (var j = 0; j < imgHeight; j++) {
        brl = brhh = ((j * imgWidth) << 2) + 1;
        greentemp = data[brl] * (brad + brad + 1);
        bluetemp = data[brl + 1] * (brad + brad + 1);
        for (var bi = 1; bi < brad; bi++) {
          if (bi < imgWidth - 1) {
            brhh += 4;
          }
          greentemp += data[brhh] + data[brhh];
          bluetemp += data[brhh + 1] + data[brhh + 1];
        }

        if (brad < imgWidth - 1) {
          brhh += 4;
        }
        greentemp += data[brhh];
        bluetemp += data[brhh + 1];
        r = ((j * imgWidth) << 2) + 1;
        tdata[r] = greentemp * bradvtrec;
        tdata[r + 1] = bluetemp * bradvtrec;
        for (var i = 1; i < imgWidth; i++) {
          greentemp -= data[brl];
          bluetemp -= data[brl + 1];
          if (i > brad) {
            brl += 4;
          }
          greentemp -= data[brl];
          bluetemp -= data[brl + 1];
          greentemp += data[brhh];
          bluetemp += data[brhh + 1];
          if (i < imgWmb) {
            brhh += 4;
          }
          greentemp += data[brhh];
          bluetemp += data[brhh + 1];
          r += 4;
          tdata[r] = greentemp * bradvtrec;
          tdata[r + 1] = bluetemp * bradvtrec;
        }
      }
    }
    if (decbright) {
      r = 0;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          pixels.data[r + 1] = Math.pow(
            (tdata[r + 1] * brightc + brighto) * 0.5,
            gc
          );
          pixels.data[r + 2] = Math.pow(
            (tdata[r + 2] * brightc + brighto) * 0.5,
            gc
          );
          pixels.data[r] = pixels.data[r + 1];
          r += 4;
        }
      }
    }
    else {
      r = 0;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          pixels.data[r + 1] = Math.pow(tdata[r + 1] + brighto, gc);
          pixels.data[r + 2] = Math.pow(tdata[r + 2] + brighto, gc);
          pixels.data[r] = pixels.data[r + 1];
          r += 4;
        }
      }
    }
  }
  else {
    if (decbright) {
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          redtemp += tdata[r] = Math.pow(pixels.data[r], 2.2);
          r++;
          greentemp += tdata[r] = Math.pow(pixels.data[r], 2.2);
          r++;
          bluetemp += tdata[r] = Math.pow(pixels.data[r], 2.2);
          r += 2;
        }
      }
      redtemp = redtemp / (imgWidth * imgHeight);
      greentemp = greentemp / (imgWidth * imgHeight);
      bluetemp = bluetemp / (imgWidth * imgHeight);
      brighto = redtemp * 0.3 + greentemp * 0.59 + bluetemp * 0.11;
    }
    else {
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          tdata[r] = Math.pow(pixels.data[r], 2.2);
          r++;
          tdata[r] = Math.pow(pixels.data[r], 2.2);
          r++;
          tdata[r] = Math.pow(pixels.data[r], 2.2);
          r += 2;
        }
      }
    }
    for (var brad = 1; brad < decac; brad++) {
      var // Value for dividing summed pixel values of the averaging window
        bradvtrec = 1 / (brad * 4),
        imgWmb = imgWidth - brad,
        imgHmb = imgHeight - brad;
      r = 0;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          data[r] = tdata[r];
          r++;
          data[r] = tdata[r];
          r++;
          data[r] = tdata[r];
          r += 2;
        }
      }
      for (var i = 0; i < imgWidth; i++) {
        brl = brhh = i << 2;
        redtemp = data[brl] * (brad + brad + 1);
        greentemp = data[brl + 1] * (brad + brad + 1);
        bluetemp = data[brl + 2] * (brad + brad + 1);
        for (var bj = 1; bj < brad; bj++) {
          if (bj < imgHeight - 1) {
            brhh += imgWF;
          }
          redtemp += data[brhh] + data[brhh];
          greentemp += data[brhh + 1] + data[brhh + 1];
          bluetemp += data[brhh + 2] + data[brhh + 2];
        }

        if (brad < imgHeight - 1) {
          brhh += imgWF;
        }
        redtemp += data[brhh];
        greentemp += data[brhh + 1];
        bluetemp += data[brhh + 2];
        r = i << 2;
        tdata[r] = redtemp * bradvtrec;
        tdata[r + 1] = greentemp * bradvtrec;
        tdata[r + 2] = bluetemp * bradvtrec;
        for (var j = 1; j < imgHeight; j++) {
          redtemp -= data[brl];
          greentemp -= data[brl + 1];
          bluetemp -= data[brl + 2];
          if (j > brad) {
            brl += imgWF;
          }
          redtemp -= data[brl];
          greentemp -= data[brl + 1];
          bluetemp -= data[brl + 2];
          redtemp += data[brhh];
          greentemp += data[brhh + 1];
          bluetemp += data[brhh + 2];
          if (j < imgHmb) {
            brhh += imgWF;
          }
          redtemp += data[brhh];
          greentemp += data[brhh + 1];
          bluetemp += data[brhh + 2];
          r += imgWF;
          tdata[r] = redtemp * bradvtrec;
          tdata[r + 1] = greentemp * bradvtrec;
          tdata[r + 2] = bluetemp * bradvtrec;
        }
      }
      r = 0;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          data[r] = tdata[r];
          r++;
          data[r] = tdata[r];
          r++;
          data[r] = tdata[r];
          r += 2;
        }
      }

      for (var j = 0; j < imgHeight; j++) {
        brl = brhh = (j * imgWidth) << 2;

        redtemp = data[brl] * (brad + brad + 1);
        greentemp = data[brl + 1] * (brad + brad + 1);
        bluetemp = data[brl + 2] * (brad + brad + 1);

        for (var bi = 1; bi < brad; bi++) {
          if (bi < imgWidth - 1) {
            brhh += 4;
          }
          redtemp += data[brhh] + data[brhh];
          greentemp += data[brhh + 1] + data[brhh + 1];
          bluetemp += data[brhh + 2] + data[brhh + 2];
        }

        if (brad < imgWidth - 1) {
          brhh += 4;
        }
        redtemp += data[brhh];
        greentemp += data[brhh + 1];
        bluetemp += data[brhh + 2];

        r = (j * imgWidth) << 2;
        tdata[r] = redtemp * bradvtrec;
        tdata[r + 1] = greentemp * bradvtrec;
        tdata[r + 2] = bluetemp * bradvtrec;

        for (var i = 1; i < imgWidth; i++) {
          redtemp -= data[brl];
          greentemp -= data[brl + 1];
          bluetemp -= data[brl + 2];

          if (i > brad) {
            brl += 4;
          }

          redtemp -= data[brl];
          greentemp -= data[brl + 1];
          bluetemp -= data[brl + 2];

          redtemp += data[brhh];
          greentemp += data[brhh + 1];
          bluetemp += data[brhh + 2];

          if (i < imgWmb) {
            brhh += 4;
          }

          redtemp += data[brhh];
          greentemp += data[brhh + 1];
          bluetemp += data[brhh + 2];

          r += 4;
          tdata[r] = redtemp * bradvtrec;
          tdata[r + 1] = greentemp * bradvtrec;
          tdata[r + 2] = bluetemp * bradvtrec;
        }
      }
    }
    if (decbright) {
      r = 0;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          pixels.data[r] = Math.pow((tdata[r] + brighto) * 0.5, gc);
          r++;
          pixels.data[r] = Math.pow((tdata[r] + brighto) * 0.5, gc);
          r++;
          pixels.data[r] = Math.pow((tdata[r] + brighto) * 0.5, gc);
          r += 2;
        }
      }
    } else {
      r = 0;
      for (var i = 0; i < imgWidth; i++) {
        for (var j = 0; j < imgHeight; j++) {
          pixels.data[r] = Math.pow(tdata[r], gc);
          r++;
          pixels.data[r] = Math.pow(tdata[r], gc);
          r++;
          pixels.data[r] = Math.pow(tdata[r], gc);
          r += 2;
        }
      }
    }
  }
  return pixels;
}
