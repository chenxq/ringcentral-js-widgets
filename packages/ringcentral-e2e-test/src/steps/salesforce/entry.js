
const location = 'https://na78.salesforce.com/home/showAllTabs.jsp';
export default class Entry {
  static async goto(context) {
    const { options: { config, driver }, page } = context;
    await $(page).waitForSelector('#username', { visible: true });
    await $(page).type('#username', config.username, { selector: 'css' });
    await $(page).type('#password', config.password, { selector: 'css' });
    await $(page).click('#Login', { selector: 'css' });
    await $(page).waitFor('body', { selector: 'css' });
    if (driver === 'seleniumWebdriverSafari') {
      // compatibility for safari
      await $(page).waitFor(2000);
    }
  }

  static async _classic(context) {
    const { page } = context;
    // TODO optimize waiting time
    await $(page).waitFor(8000);
    await $(page).waitForSelector('#SoftphoneIframe');
    const app = await $(page).waitForFrames(['#SoftphoneIframe', '#rcAppClassic']);
    return app;
  }

  static async _lightning(context) {
    const { page } = context;
    await $(page).click('.switch-to-lightning');
    // TODO optimize waiting time
    await $(page).waitFor(2000);
    await $(page).click('.flexipageComponent');
    // TODO optimize waiting time
    await $(page).waitFor(8000);
    await $(page).waitForSelector('iframe.openctiSoftPhone');
    const app = await $(page).waitForFrames(['iframe.openctiSoftPhone', '#rcAppLightning']);
    return app;
  }

  static async routeMode(context) {
    // TODO optimize waiting time
    await $(context.page).waitFor(2000);
    await $(context.page).goto(location);
    context.app = await this[`_${context.options.tag.modes}`](context);
  }

  static get steps() {
    return [
      this.goto,
      this.routeMode,
    ];
  }
}