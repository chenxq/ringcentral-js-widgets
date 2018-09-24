const puppeteer = require('puppeteer');
const {
  Driver: BaseDriver,
  Query: BaseQuery
} = require('../base');

const setting = {
  ignoreHTTPSErrors: true,
  args: [
    '--use-fake-ui-for-media-stream',
    // '--load-extension=/path/to/extension/'
  ]
};
class Query extends BaseQuery {
  async getText(selector, options = {}) {
    const _selector = this.getSelector(selector, options);
    await this.waitForSelector(selector, options);
    const innerText = await this._node.$eval(_selector, node => node.innerText);
    return innerText;
  }

  async click(selector, options) {
    const _selector = this.getSelector(selector, options);
    await this._node.click(_selector);
  }

  async type(selector, value, options) {
    const _selector = this.getSelector(selector, options);
    await this._node.type(_selector, value);
  }

  async waitForSelector(selector, options) {
    const _selector = this.getSelector(selector, options);
    const element = await this._node.waitForSelector(_selector, options);
    return element;
  }

  async waitForFrames(frameIds) {
    let frame = this._node;
    for (const frameId of frameIds) {
      await frame.waitForFunction(`document.querySelector('#${frameId}')`);
      frame = this._node.frames().find(frame => frame.name() === frameId);
    }
    return frame;
  }

  async waitForFunction(...args) {
    await this._node.waitForFunction(...args);
  }

  async screenshot({ path } = {}) {
    await this._node.screenshot({
      path
    });
  }

  async goto(url) {
    await this._node.goto(url);
  }

  async execute(...args) {
    const result = await this._node.evaluate(...args);
    return result;
  }

  async clear(selector, options) {
    await this.waitForSelector(selector, options);
    const _selector = this.getSelector(selector, options);
    await this._node.focus(_selector);
    await this._node.$eval(_selector, input => input.select(), _selector);
    if (this._node.keyboard) {
      await this._node.keyboard.down('Delete');
      await this._node.keyboard.up('Delete');
    } else {
      await this._node.evaluate(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Delete' }));
      });
    }
  }

  async $(selector, options) {
    const _selector = this.getSelector(selector, options);
    const element = await this._node.$(_selector);
    return element;
  }

  async $$(selector, options) {
    const _selector = this.getSelector(selector, options);
    const elements = await this._node.$$(_selector);
    return elements;
  }
}

class Driver extends BaseDriver {
  constructor(options = {}, program = puppeteer) {
    super(options, program);
  }

  async run() {
    this._browser = await this._program.launch(this._options.driver.setting);
  }

  async newPage() {
    this._page = await this._browser.newPage();
  }

  async goto(config) {
    await this._page.goto(config.location);
  }

  async closePage() {
    await this._page.close();
    this._page = null;
  }

  async close() {
    if (this._browser) {
      try {
        await this._browser.close();
      } catch (e) {
        console.error(e);
      }
    }
  }
}

module.exports = {
  Driver,
  setting,
  Query,
};