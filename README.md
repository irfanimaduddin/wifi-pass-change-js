# WiFi Password Changer

An automated tool to change WiFi passwords on specific router models using Selenium WebDriver.

## Description

This script automates the process of changing WiFi passwords for both 2.4GHz and 5GHz networks on supported routers. It uses Selenium WebDriver to interact with the router's web interface.

## Router Model

- Huawei EG8145V5

## Prerequisites

- Node.js (v20.18.0 or higher)
- selenium-webdriver (v4.27.0 or higher)
- argparse (v2.0.1 or higher)

## Installation

1. Clone the repository
```bash
git clone https://github.com/irfanimaduddin/wifi-pass-change-js.git
cd wifi-pass-change-js
```

2. Install dependencies
```bash
npm install 
```

3. Update the ChromeDriver path in the script to match your system setup

## Usage

Run the script with the following command:

```bash
node changeWifiPass.js --ip "192.168.1.1" -u "admin" -p "admin_pass" --new-pass "new_wifi_password"
```

### Arguments

- `--ip`: Router IP address (required)
- `-u, --username`: Admin username for router login (required)
- `-p, --password`: Admin password for router login (required)
- `--new-pass`: New WiFi password to set (required)

### Help

To see all available options:

```bash
node changeWifiPass.js --help
```

## Features

- Automated login to router interface
- Changes password for both 2.4GHz and 5GHz networks
- Headless operation (runs in background)
- Validation of current and new passwords
- Console output of changes made

## Example Output

```
Changing pass for SSID: MyNetwork_2G
Current Password: oldpassword123
New Password: newpassword123

Changing pass for SSID: MyNetwork_5G
Current Password: oldpassword123
New Password: newpassword123
```

## Notes

- The script is configured to run in headless mode by default
- Includes wait times to account for page loading
- Automatically handles iframe switching
- Validates password changes before completing

## Security Considerations

- Avoid storing credentials in the script
- Use secure passwords
- Run on trusted networks only

## Author

Irfan Imaduddin
