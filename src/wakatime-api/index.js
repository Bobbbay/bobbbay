// Grab https
const https = require("https");

// Define a callback function that is constant throughout all requests
const callback = function (response) {
  var str = "";
  response.on("data", function (chunk) {
    str += chunk;
  });
  response.on("end", function () {
    const fs = require("fs");

    let chart = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 42 42" class="donut">
  <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#d2d3d4" stroke-width="3"></circle>
`;

    str = JSON.parse(str);

    let rawdata = fs.readFileSync("data/colors.json");
    let parsed = JSON.parse(rawdata);

    allLength = 0;
    color = "";
    usedColors = [];
    usedLanguages = [];
    for (i = 0; i < str.data.languages.length; i++) {
      try {
        color = parsed[str.data.languages[i].name].color;
      } catch {
        color = "#EEE";
      }

      usedColors.push(color);
      usedLanguages.push(str.data.languages[i].name);

      chart += `  <circle class="donut-segment" 
    cx="21" cy="21" r="15.91549430918954" 
    fill="transparent" stroke="${color}" 
    stroke-width="3" 
    stroke-dasharray="${str.data.languages[i].percent} ${
        100 - str.data.languages[i].percent
      }"
    stroke-dashoffset="${100 - allLength + 25}">
  </circle>
`;
      allLength += str.data.languages[i].percent;
    }

    chart += `</svg>`;

    fs.writeFile("./build/build.svg", chart, function (err) {
      if (err) return console.log(err);
    });

    let colorNames = ``;

    for (i = 0; i < usedLanguages.length; i++) {
      colorNames += `
  <rect 
    width="50" height="50" 
    style="fill:${usedColors[i]};" 
    y="${i * 50}" 
  />
  <text 
    font-family="Arial, Helvetica, sans-serif" 
    font-size="50" 
    x="60" y="${(i + 1) * 50 - 5}">
    ${usedLanguages[i]}: ${str.data.languages[i].text}
  </text>
`;
    }

    colorNames =
      `<svg xmlns="http://www.w3.org/2000/svg" 
  height="${i * 50}" width="${i * 50 * 2}"
>` + colorNames;

    colorNames += `</svg>`;

    fs.writeFile("./build/build.names.svg", colorNames, function (err) {
      if (err) return console.log(err);
    });

    console.log("Run successful.");
  });
};

/* A default request setup looks like the following: 
https
  .request(
    { host: "wakatime.com", path: "/api/v1/users/@bobbbay/stats/last_7_days" },
    callback
  )
  .end();
*/

let last7Days = https
  .request(
    { host: "wakatime.com", path: "/api/v1/users/@bobbbay/stats/last_7_days" },
    callback
  )
  .end();
