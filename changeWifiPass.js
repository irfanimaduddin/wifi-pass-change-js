const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const argparse = require('argparse');

// Create argument parser
const parser = new argparse.ArgumentParser({
    description: 'Change WiFi password on a router using a web interface'
});

parser.add_argument('--ip', {
    help: 'IP of the router (e.g., http://192.168.1.1)',
    required: true
});

parser.add_argument('-u', '--username', {
    help: 'Admin username to login to the router',
    required: true
});

parser.add_argument('-p', '--password', {
    help: 'Admin password to login to the router',
    required: true
});

parser.add_argument('--new-pass', {
    help: 'New WiFi password to set',
    required: true
});

// Parse arguments
const args = parser.parse_args();

// Use the parsed arguments
const url = `http://${args.ip}`;
const uName = args.username;
const uPass = args.password;
const new_pass = args.new_pass;

const service = new chrome.ServiceBuilder('path/to/chromedriver'); // Update with your chromedriver path
const options = new chrome.Options();
options.addArguments('--headless'); // Run in headless mode
options.addArguments('--disable-extensions');

async function changePassword(driver, freq) {
    if (freq === '5g') {
        // Select Basic 5 GHz Tab
        const getFreq = await driver.findElement(By.name('subdiv_WlanBasic5G'));
        await getFreq.click();
        await driver.sleep(3000); // Wait for the page to load
    }

    // Switch to the iframe
    const iframe = await driver.findElement(By.id('frameContent'));
    await driver.switchTo().frame(iframe);

    if (freq === '2g') {
        // Select Secondary 2.4 GHz Tab
        const wifiChooseButton = await driver.findElement(By.xpath('//*[@id="record_1"]'));
        await wifiChooseButton.click();
    }

    // Check WiFi SSID Name
    const ssidName = await driver.findElement(By.xpath('//*[@id="wlSsid"]'));
    const ssid = await ssidName.getAttribute('value');

    // Uncheck the hide password checkbox
    const passCheckbox = await driver.findElement(By.xpath('//*[@id="hidewlWpaPsk"]'));
    if (await passCheckbox.isSelected()) {
        await passCheckbox.click();
    }

    // Clear the existing password and enter a new one
    const passText = await driver.findElement(By.xpath('//*[@id="twlWpaPsk"]'));
    const prevPass = await passText.getAttribute('value');
    await passText.clear();
    await passText.sendKeys(new_pass);
    const newPass = await passText.getAttribute('value');

    await driver.sleep(2000); // Wait for the page to load

    // Submit the changes
    const submitButton = await driver.findElement(By.xpath('//*[@id="btnApplySubmit"]'));
    await submitButton.click();

    await driver.sleep(3000); // Wait for the page to load

    // Switch back to the default content
    await driver.switchTo().defaultContent();

    await driver.sleep(3000); // Wait for the page to load

    return { ssid, prevPass, newPass };
}

async function main() {
    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    try {
        // Navigate to the URL
        await driver.get(url);

        // Find the username and password fields
        const usernameInput = await driver.findElement(By.xpath('//*[@id="txt_Username"]'));
        const passwordInput = await driver.findElement(By.xpath('//*[@id="txt_Password"]'));

        // Enter the credentials in the form fields
        await usernameInput.sendKeys(uName);
        await passwordInput.sendKeys(uPass);

        // Click the login button
        const loginButton = await driver.findElement(By.xpath('//*[@id="button"]'));
        await loginButton.click();
        await driver.sleep(3000); // Wait for the page to load

        // Open the WLAN tab
        const wlanTab = await driver.findElement(By.name('maindiv_WlanBasic2G'));
        await wlanTab.click();
        await driver.sleep(3000); // Wait for the page to load

        // Change password for 2g
        const result2g = await changePassword(driver, '2g');
        console.log(`Changing pass for SSID: ${result2g.ssid}`);
        console.log(`Current Password: ${result2g.prevPass}`);
        console.log(`New Password: ${result2g.newPass}`);

        // Change password for 5g
        const result5g = await changePassword(driver, '5g');
        console.log(`Changing pass for SSID: ${result5g.ssid}`);
        console.log(`Current Password: ${result5g.prevPass}`);
        console.log(`New Password: ${result5g.newPass}`);

    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Execute the main function
main().catch(console.error);