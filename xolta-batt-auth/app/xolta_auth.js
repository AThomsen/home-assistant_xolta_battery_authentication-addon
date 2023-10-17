const puppeteer = require('puppeteer-core');

function sleep(ms) {
    return new Promise((resolve) => setInterval(resolve, ms));
}

async function doLogin(username, password) {
    const timeout = 10000; // 10 seconds

    const start_time = Date.now();
    const auth_response = {};

    try {
        console.log("Xolta: requesting site");
        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: '/usr/bin/chromium',
            args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
        });
        
        try {
            console.log("Start Request");
            const page = await browser.newPage();
            await page.goto('https://app.xolta.com/');

            console.log("Login form");

            await page.waitForSelector('#email');
            await page.type('#email', username);
            await page.type('#password', password);

            const submitButton = await page.waitForSelector('#next', { timeout });

            // Wait for ½ second as this seems to fix issues for some.
            await sleep(500);
            
            // set up listeners
            const submitResponseWaitForPromise = page.waitForResponse(response => response.url().includes('B2C_1_sisu/SelfAsserted') && response.status() === 200, { timeout });
            const tokenResponseWaitForPromise = page.waitForResponse(response => response.url().includes('b2c_1_sisu/oauth2/v2.0/token') && response.status() === 200, { timeout });
            tokenResponseWaitForPromise.catch(e => e);

            await submitButton.click();

            // Check if username/password is correct
            // - if not, json will be returned with a "status" field that's != 200 (the http response is still 200 though)
            const submitResponse = await submitResponseWaitForPromise;

            login_ok = true;

            try {
                const data = await submitResponse.json();

                // copy login status and any messages to result
                Object.assign(auth_response, data);
                login_ok = data.status === '200';
            } catch {
                // On successfull login, no body is returned and "submitResponse.json()" wil fail. So all is well :-)
            }

            if (login_ok) {
                // login successful. Wait for token...
                tokenResponse = await tokenResponseWaitForPromise;
                const tokenData = await tokenResponse.json();

                Object.assign(auth_response, {
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                });
            }
        }
        finally {
            try {
                await browser.close();
            }
            catch(e) {}
        }
    } catch (e) {
        console.log("XoltaBattAuthenticator Error: " + e.toString());
        Object.assign(auth_response, {
            status: '500',
            message: e.toString(),
        });
    }

    Object.assign(auth_response, {
        duration: (Date.now() - start_time) / 1000, // Convert to seconds
    });

    console.log("Return: " + JSON.stringify(auth_response));
    return auth_response;
}

module.exports = { doLogin };

// // Example usage:
// const inputData = {
//     username: 'xx',
//     password: 'xx'
// };

// doLogin(inputData)
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
