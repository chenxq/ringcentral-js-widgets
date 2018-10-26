const fs = require('fs');
const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const safari = require('selenium-webdriver/safari');
const ie = require('selenium-webdriver/ie');
const edge = require('selenium-webdriver/edge');
const {
  Driver: BaseDriver,
  Query: BaseQuery
} = require('../base');


const Browsers = {
  chrome: 'chrome',
  edge: 'MicrosoftEdge',
  firefox: 'firefox',
  ie: 'internet explorer',
  safari: 'safari',
};

const seleniumWebdriverSetting = {
  safari: new safari.Options(),
  chromeHeadless: new chrome.Options().headless(),
  chrome: new chrome.Options(),
  firefoxHeadless: new firefox.Options().headless(),
  firefox: new firefox.Options(),
  ie: new ie.Options(),
  edge: new edge.Options(),
};

class Query extends BaseQuery {
  async getText(selector, options) {
    const element = await this._getElement(selector, options);
    const innerText = element.getAttribute('innerText');
    return innerText;
  }

  async click(selector, options) {
    const element = await this._getElement(selector, options);
    await element.click();
  }

  async type(selector, value, options) {
    const element = await this._getElement(selector, options);
    await element.sendKeys(value);
  }

  async waitForSelector(selector, options) {
    const element = await this._getElement(selector, options);
    return element;
  }

  async goto(url) {
    await this._node.get(url);
  }

  async screenshot({
    path
  } = {}) {
    await this._node.takeScreenshot().then((data) => {
      const base64Data = data.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path, base64Data, 'base64');
    });
  }

  async waitForFrames(frameIds) {
    for (const frameId of frameIds) {
      const element = await this._node.wait(until.elementLocated(By.id(frameId)));
      await this._node.switchTo().frame(element);
    }
    return this._node;
  }

  async execute(...args) {
    let script = args.shift();
    if ((typeof script !== 'string' && typeof script !== 'function')) {
      throw new Error('number or type of arguments don\'t agree with execute protocol command');
    }
    if (typeof script === 'function') {
      script = `return (${script}).apply(null, arguments)`;
    }
    // TODO safari
    const handle = this._node.executeScript(script, args);
    await this.waitFor(100);
    // wait for applying to UI.
    return handle;
  }

  async clear(selector, options) {
    const element = await this._getElement(selector, options);
    element.clear();
  }

  // async $(selector) {
  //   const element = await this._node.$(selector);
  //   return element;
  // }

  // async $$(selector) {
  //   const elements = await this._node.$$(selector);
  //   return elements;
  // }

  async _getElement(selector, options) {
    const _selector = this.getSelector(selector, options);
    const element = await this._node.wait(until.elementLocated(By.css(_selector)));
    return element;
  }
}


module.exports = (browser) => {
  const webdriver = browser.toLowerCase();
  const setKeyName = `set${browser}Options`;
  const setting = seleniumWebdriverSetting[webdriver];
  class Driver extends BaseDriver {
    constructor(options = {}, program = new Builder()) {
      super(options, program);
    }

    async run({ isHeadless } = {}) {
      this._isHeadless = isHeadless;
    }

    async newPage() {
      let _setting = this._options.driver.setting;
      if (this._isHeadless) {
        _setting = seleniumWebdriverSetting[`${webdriver}Headless`] || _setting;
      }
      this._browser = this._program
        .forBrowser(Browsers[webdriver])[setKeyName](
          _setting
        )
        .withCapabilities({
          browserName: webdriver,
          acceptSslCerts: true,
          acceptInsecureCerts: true
        })
        .build();
      this._page = this._browser;
    }

    async goto(config) {
      await this._browser.get(config.location);
    }

    async closePage() {
      await this.close();
    }

    async close() {
      if (this._browser) {
        try {
          await this._browser.close();
        } catch (e) {
          // console.error(e);
        }
        try {
          await this._browser.quit();
        } catch (e) {
          // console.error(e);
        }
      }
    }
  }

  return {
    Driver,
    setting,
    Query,
  };
};