const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const dateFormat = require('dateformat');

const ONE_MINUTE = 30 * 1000;
const nowSession = new Date();
const timeStampSession = dateFormat(nowSession, 'yyyymmddHHMMss');
const reportPath = path.join('./output', timeStampSession);
if (!fs.existsSync(reportPath)) fs.mkdirSync(reportPath);

function showTime() {
    (async () => {
        console.log('Start');
        const now = new Date();
        const timeStamp = dateFormat(now, 'yyyymmddHHMMss');
        //const reportPath = path.join('./output/', timeStamp, '/');
        console.log(timeStamp);
        console.log(reportPath);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.tracing.start({screenshots: false, path: path.join(reportPath, timeStamp + '-trace.json')});
        await page.goto('https://www.myunidays.com/GB/en-GB/category/all-fashion', {timeout: 60000});
        await page.tracing.stop();

        await page.content();
        await page.screenshot({path: path.join(reportPath, timeStamp + '-screenshot.png')});

        /*const tracing = JSON.parse(fs.readFileSync(path.join(reportPath, 'trace.json'), 'utf8'));
        const traceScreenshots = tracing.traceEvents.filter(x => (
            x.cat === 'disabled-by-default-devtools.screenshot' &&
            x.name === 'Screenshot' &&
            typeof x.args !== 'undefined' &&
            typeof x.args.snapshot !== 'undefined'
        ));
        traceScreenshots.forEach(function (snap, index) {
            fs.writeFile(path.join(reportPath, 'trace-screenshot-' + index + '.png'), snap.args.snapshot, 'base64', function (err) {
                if (err) {
                    console.log('writeFile error', err);
                }
            });
        });*/

        await page.close();

        console.log('Finished');

    })();
}

setInterval(showTime, ONE_MINUTE);

showTime();