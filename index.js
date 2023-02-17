const puppeteer = require('puppeteer');
const fs = require("fs");

const pagimation = 2;
(async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, slowMo: 350 });
    console.time("new page open");

    let page = await browser.newPage(); // viewport and device scale factor of my laptop 
    await page.setViewport({ width: 1080, height: 1800 });
    // await page.setViewport({ width: 1080, height: 1800, deviceScaleFactor: 2 });
    let aptPage = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1800 });

    console.timeEnd("new page open");
    console.time("open list.am/login");

    await page.goto('https://www.list.am/login', {
      // waitUntil: "networkidle2",
    });
    await page.waitForSelector('a[href="/register"]');
    await page.screenshot({ path: 'list.am/login.png' });
    console.timeEnd("open list.am/login");

    await page.focus("#_idyour_email");
    await page.keyboard.type(process.env.EMAIL);
    await page.focus("#_idpassword");
    await page.keyboard.type(process.env.PASSWORD);
    await page.keyboard.press("Enter");
    await page.click('#action__form_action0"]'); //login button

    await page.goto('https://www.list.am/my', {
      // waitUntil: "networkidle2",
    });

    await page.waitForSelector('.dle'); // '.dle > l > div'

    var itemsDivs = await page.$$eval('.dle > l > div', as => as.map(a => a.href));

    console.log('itemsDivs > ', itemsDivs);
    // loops goes here
    // for(let pageNumber = 0; pageNumber < pagimation; pageNumber++) {
    //   await page.waitForSelector('a.main');

    //   var hrefs = await page.$$eval('a.main', as => as.map(a => a.href));

    //   console.time("appartments_scraping");

    //   var appartaments = [];
    //   for(let i = 0; i < hrefs.length; i++) {
    //     await aptPage.goto(hrefs[i], {
    //         // waitUntil: "networkidle2",
    //     });
    //     await aptPage.waitForSelector('.price');

    //     let apt = await aptPage.evaluate(() => {
    //       const app = {};
    //       const price = document.querySelectorAll(".price")[0];
    //       app.price = price ? price.innerHTML : '';
    //       const housing = document.querySelectorAll(".housing")[0] ? document.querySelectorAll(".housing")[0].innerHTML : ''
    //       const brba = document.querySelectorAll("p.attrgroup > span.shared-line-bubble > b");
    //       const br = brba[0] ? brba[0].innerHTML : '';
    //       const ba = brba[1] ? brba[1].innerHTML : '';
    //       const map = document.querySelectorAll("#map")[0];
    //       const longitude = map ? map.getAttribute('data-longitude') : ''
    //       const latitude = map ? map.getAttribute('data-latitude') : ''
    //       const accuracy = map ? map.getAttribute('data-accuracy') : ''
    //       let sqrfeet = '';
    //       if(housing.toLowerCase().search('ft') === -1) {
    //           sqrfeet = '';
    //       } else {
    //           let lastSpaceIndex = housing.toLowerCase().split('ft')[0].lastIndexOf(' ')
    //           sqrfeet = housing.toLowerCase().split('ft')[0].slice(lastSpaceIndex).trim()
    //       }
    //       let bedrooms = '';
    //       if(housing.toLowerCase().search('br') === -1) {
    //           bedrooms = '';
    //       } else {
    //           bedrooms = housing.toLowerCase().split('/')[1].split('br')[0].trim()
    //       }
    //       app.bedrooms = bedrooms || br;
    //       app.bathrooms = ba;
    //       app.sqrfeet = sqrfeet;
    //       app.location = { longitude, latitude, accuracy };
    //       return app;
    //     })
    //     apt.link = hrefs[i];
    //     appartaments.push(apt)
    //   }
    //   await page.click(".cl-next-page");
    //   // pagimation code goes here click cl-next-page
    //   fs.writeFileSync(`appartments${pageNumber}.json`, JSON.stringify(appartaments, null, 2));
    // }

    // console.timeEnd("appartments_scraping");        
    // console.log('appartaments >>> ', appartaments);

    await browser.close();
  } catch (e) {
    console.error(e);
    // fs.writeFileSync("appartments_interrupted.json", JSON.stringify(appartaments));
  }
})();
