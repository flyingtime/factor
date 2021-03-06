# Config, Settings and Style

## 4 Types of Config Files

Factor provides a configuration system that works in harmony with standards:

- **Public Config** &rarr; `package.json` > `factor`<br> Publicly accessible configuration for your application. This file is writeable by utilities and used for admin users, public API keys, etc.

- **Private Config** &rarr; `.env`<br> A standard way of storing your private keys and information (powered by [Dotenv](https://github.com/motdotla/dotenv)). Anything here gets translated to "environmental variables" when you are running your app.

- **Customization Settings** &rarr; `factor-settings.js`<br> The customization engine for your plugins, themes, etc. This is where you'll change text, set plugin options, override components, etc.

- **Global Styles** &rarr; `factor-styles.less`<br> Place your global css resets and styling here including CSS variable values as recommended by Factor and plugins.

## Private and Public Config

### Use `.env` for Private Keys

Factor uses the popular [Dotenv](https://github.com/motdotla/dotenv) system to help you manage your private keys and app information.

All variables added to your `.env` file will be translated to environmental variables and capable of being accessed in Factor either through `process.env` or `Factor.$config`.

#### Using Private Keys

Add keys to your `.env` file as follows:

```git
# .env
MY_SERVICE_KEY="VAL"
```

Reference the private keys using `process.env`. Note these are only available in server files running in endpoints and your CLI.

```js
const key = process.env.MY_SERVICE_KEY // "VAL"
```

**Note:** `.env` files should never be added to source control. Environmental variables should be setup and managed manually for each server environment.

## Use `package.json` or `factor-settings` Public Keys

Add public configuration information into the `package.json` file under the `factor` property. A json configuration file has one main strength: it is easily machine writeable. This means we can easy add configuration to it from the `setup` CLI, etc..

Example:

```json
//package.json
{
  "name": "my-app",
  "factor": {
    "configSetting": {
      "myKey": "hello world"
    }
  }
}
```

Alternatively, you can always using `factor-settings.js` files to add configuration. (All config and settings files are merged together in the end anyway.)

The equivalent to the `configSetting` value above looks like this:

```json
// factor-settings.js
{
  "configSetting": {
    "myKey": "hello world"
  }
}
```

### Retrieving Public Settings

Public config values are added and available using the `setting` utility.

```javascript
import { setting } from "@factor/api/settings"
// In your code
const myVariable = setting("configSetting.myKey") // hello world
```

## Global Styling

### `factor-styles`

Factor includes an optional style system that can be used for your global application styles. It works by gathering all `factor-styles` files in your app, themes and plugins and combining them in order of priority.

> Note: **factor-styles** supports `.css` or `.less` files by default.

The **factor-styles** CSS needs to be scoped to your front-end app, so make sure to wrap all styles and variables (discussed below) in a `.factor-app` class.

```css
.factor-app {
  /* my app style */
}
```

### CSS Variables

Standard CSS variables are used by plugins and themes to allow you an easy way of tweaking common style. For example, your site's primary and secondary colors, text color, background, etc.

While theme and plugin author's may support many variables, a few standard settings we recommend are:

```css
.factor-app {
  --color-primary: [value];
  --color-secondary: [value];
  --color-text: [value];
  --color-placeholder: [value];
  --color-bg: [value];
  --color-bg-contrast: [value];
  --font-weight-bold: [value];
  --font-family-primary: [value];
}
```

To change these values in your app add the above to your `factor-styles.less` file. Remember that individual extensions may add their own variables which are just as easy to customize, you'll just need to consult their documentation.

## Customization Settings

### `factor-settings.js`

"Factor settings" is a customization system built for customizing Factor extensions and Factor itself. It works by gathering all `factor-settings.js` files in your app and extensions, then merging them together in order of priority. With your app having the highest priority by default.

This final merged "settings" config is then used in your app.

Using this system its possible to fully customize your extensions depending on the specifics of the extension. (Since each extension is different we recommend consulting their documentation for exact details).

Example:

```js
// PLUGIN/THEME: example-plugin/factor-settings.js
export default {
  myCar: {
    type: "mercedes",
    color: "black"
  },
  myHouse: () => import("./house-component.vue")
}
// APP: your-app/src/factor-settings.js
export default {
  myCar: {
    color: "black"
  },
  myHouse: () => import("./custom-house-component.vue")
}
```

In the above example, a `factor-settings` file in your application would override the `myHouse` component and the `myCar.color`. The final values could be referenced in your Vue templates as follows:

```js
import { setting } from "@factor/api/settings"
// In your code
const myVariable = setting("myCar.color") // black
```
