[![Build Status](https://travis-ci.org/dhilt/ngx-ui-scroll.svg?branch=master)](https://travis-ci.org/dhilt/ngx-ui-scroll)
[![npm version](https://badge.fury.io/js/ngx-ui-scroll.svg)](https://www.npmjs.com/package/ngx-ui-scroll) 

# NgxUiScroll

Unlimited bidirectional scrolling over limited viewport. A directive for [Angular](https://angular.io/) framework. Built with [angular-library-starter](https://github.com/robisim74/angular-library-starter). Inspired by [angular-ui-scroll](https://github.com/angular-ui/ui-scroll) (AngularJS, since 2013). Demo is available at [dhilt.github.io/ngx-ui-scroll](https://dhilt.github.io/ngx-ui-scroll/).

- [Motivation](#motivation)
- [Features](#features)
- [Getting](#getting)
- [Usage](#usage)
- [Settings](#settings)
- [Adapter API](#adapter-api)
- [Development](#development)

### Motivation

Scrolling large date sets may cause performance issues. Many DOM elements, many data-bindings, many event listeners... The common way to improve this case is to render only a small portion of the data set visible to the user. Other data set elements that are not visible to the user are virtualized with upward and downward empty padding elements which should give us a consistent viewport with consistent scrollbar parameters.

The \*uiScroll is structural directive that works like \*ngFor and renders a templated element once per item from a collection. By requesting the external Datasource (the implementation of which is a developer responsibility) the \*uiScroll directive fetches necessary portion of the data set and renders corresponded elements until the visible part of the viewport is filled out. It starts to retrieve new data to render new elements again if the user scrolls to the edge of visible element list. It dynamically destroys elements as they become invisible and recreates them if they become visible again.
<p align="center">
  <img src="https://raw.githubusercontent.com/dhilt/ngx-ui-scroll/master/demo/assets/ngx-ui-scroll-demo.gif">
</p>

### Features

 - unlimited bidirectional virtual scroll
 - lots of virtualization settings
 - super easy templating
 - infinite mode, [demo](https://dhilt.github.io/ngx-ui-scroll/#settings#infinite-mode)
 - horizontal mode, [demo](https://dhilt.github.io/ngx-ui-scroll/#settings#horizontal-mode)
 - entire window scrollable, [demo](https://dhilt.github.io/ngx-ui-scroll/#settings#window-viewport)
 - items with non-constant heights, [demo](https://dhilt.github.io/ngx-ui-scroll/#settings#different-item-heights)
 - API Adapter object to manipulate and assess the scroller, [demos](https://dhilt.github.io/ngx-ui-scroll/#/adapter)

### Getting

The \*uiScroll directive is a part of UiScrollModule which is available via npm –

`npm install ngx-ui-scroll`

The UiScrollModule has to be imported in the App/feature module where it is going to be used.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { UiScrollModule } from 'ngx-ui-scroll';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    UiScrollModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Usage

Basic usage template may look like

```html
<div class="viewport">
  <div *uiScroll="let item of datasource">
    <b>{{item.text}}</b>
  </div>
</div>
```

where the viewport is a scrollable area of finite height.

```css
.viewport {
    height: 300px;
    overflow-y: auto;
    overflow-anchor: none;
}
```

\*uiScroll acts like \*ngFor, but the datasource is an object of special type (IDatasource). It implements method _get_ to be used by the \*uiScroll directive to access the data by _index_ and _count_ parameters.

```javascript
import { IDatasource } from 'ngx-ui-scroll';

export class AppComponent {
  datasource: IDatasource = {
    get: (index, count, success) => {
      const data = [];
      for (let i = index; i <= index + count - 1; i++) {
        data.push({ text: 'item #' + i });
      }
      success(data);
    }
  };
}
```

_Datasource.get_ must provide an array of _count_ data-items started from _index_ position. _Datasource.get_ has 3 signatures: callback based, Promise based and Observable based. So, if we want some remote API to be a source of our data, basically it may look like

```javascript
  datasource: IDatasource = {
    get: (index, count) =>
      this.http.get(`${myApiUrl}?index=${index}&count=${count}`)
  };
```

More details could be found on the [Datasource demo page](https://dhilt.github.io/ngx-ui-scroll/#/datasource).

### Settings

Datasource implementation along with _get_ method property may include _settings_ object property:

```javascript
  datasource: IDatasource = {
    get: ...,
    settings: {
      minIndex: 0,
      startIndex: 0,
      ...
    }
  };
```

Settings are being applied during the uiScroll initialization and have an impact on how the uiScroll behaves. Below is the list of available settings with descriptions, defaults, types and demos.

|Name|Type|Default|Description|
|:--|:----:|:----------:|:----------|
|[bufferSize](https://dhilt.github.io/ngx-ui-scroll/#settings#buffer-size)|number,<br>integer|5| Fixes minimal size of the pack of the datasource items to be requested per single _Datasource.get_ call. Can't be less than 1. |
|[padding](https://dhilt.github.io/ngx-ui-scroll/#settings#padding)|number,<br>float|0.5| Determines viewport outlets relative to the viewport's size that need to be filled. For example, 0.5 means that we'll have as many items at a moment as needed to fill out 100% of the visible part of the viewport, + 50% of the viewport size in backward direction and + 50% in forward direction. The value can't be less than 0.01. |
|[startIndex](https://dhilt.github.io/ngx-ui-scroll/#settings#start-index)|number,<br>integer|1| Specifies item index to be requested/rendered first. Can be any, but real datasource boundaries should be taken into account. |
|[minIndex](https://dhilt.github.io/ngx-ui-scroll/#settings#min-max-indexes)|number,<br>integer|-Infinity| Fixes absolute minimal index of the data set. The datasource left boundary. |
|[maxIndex](https://dhilt.github.io/ngx-ui-scroll/#settings#min-max-indexes)|number,<br>integer|+Infinity| Fixes absolute maximal index of the data set. The datasource right boundary. |
|[infinite](https://dhilt.github.io/ngx-ui-scroll/#settings#infinite-mode)|boolean|false| Allows to run "infinite" mode, when items rendered once are never removed. |
|[horizontal](https://dhilt.github.io/ngx-ui-scroll/#settings#horizontal-mode)|boolean|false| Allows to run "horizontal" mode, when the viewport's orientation is horizontal. |
|[windowViewport](https://dhilt.github.io/ngx-ui-scroll/#settings#window-viewport)|boolean|false| Allows to run "entire window scrollabe" mode, when the entire window becomes the scrollable viewport. |

### Adapter API

The uiScroll has API to assess its parameters and provide some manipulations run-time. This API is available via special Adapter object. The datasource needs to be instantiated via operator "new" fot the Adapter object to be added to it:

```javascript
import { Datasource } from 'ngx-ui-scroll';
...
  datasource = new Datasource({
    get: ... ,
    settings: { ... }
  });
```

Then `this.datasource.adapter.version`, `this.datasource.adapter.reload()` and other Adapter expressions become legal. Below is the list of read-only properties of the Adapter API.

|Name|Type|Description|
|:--|:----|:----------|
|version|string|Current version of ngx-ui-scroll library|
|[isLoading](https://dhilt.github.io/ngx-ui-scroll/#/adapter#is-loading)|boolean|Indicates whether the uiScroll is working ot not. |
|[isLoading$](https://dhilt.github.io/ngx-ui-scroll/#/adapter#is-loading)|BehaviorSubject<br>&lt;boolean&gt;|An Observable version of "isLoading" property. |
|[itemsCount](https://dhilt.github.io/ngx-ui-scroll/#/adapter#items-count)|number|A number of items that are rendered in the viewport at a moment.|
|[firstVisible](https://dhilt.github.io/ngx-ui-scroll/#/adapter#first-last-visible-items)|ItemAdapter {<br>&nbsp;&nbsp;$index?:&nbsp;number;<br>&nbsp;&nbsp;data?:&nbsp;any;<br>&nbsp;&nbsp;element?:&nbsp;HTMLElement;<br>}|Object of ItemAdapter type containing information about first visible item, where "$index" corresponds to the datasource item index value, "data" is exactly the item's content, "element" is a link to DOM element which is relevant to the item. |
|[firstVisible$](https://dhilt.github.io/ngx-ui-scroll/#/adapter#first-last-visible-items)|BehaviorSubject<br>&lt;ItemAdapter&gt;|An observable version of "firstVisible" property. |
|[lastVisible](https://dhilt.github.io/ngx-ui-scroll/#/adapter#first-last-visible-items)|ItemAdapter|Object of ItemAdapter type containing information about last visible item. |
|[lastVisible$](https://dhilt.github.io/ngx-ui-scroll/#/adapter#first-last-visible-items)|BehaviorSubject<br>&lt;ItemAdapter&gt;|An observable version of "lastVisible" property. |

Below is the list of invocable methods of the Adapter API.

|Name|Parameters|Description|
|:--|:----|:----------|
|[reload](https://dhilt.github.io/ngx-ui-scroll/#/adapter#reload)|(startIndex?:&nbsp;number)|Resets the items buffer, resets the viewport params and starts fetching items from "startIndex" (if set). |

### Development

There are some npm scripts available from package.json:

- `npm start` to run demo App on port 4200
- `npm test` to run Karma tests
- `npm run build` to build the ngx-ui-scroll module into the ./dist folder
- `npm run pack:install` to build tar-gzipped version of package and install it locally into ./node_modules

Along with settings object the datasource implementation may include also devSettings object: 

```javascript
import { Datasource } from 'ngx-ui-scroll';
...
  datasource = new Datasource({
    get: ... ,
    settings: { ... },
    devSettings: {
      debug: true,
      immediateLog: true,
      ...
    }
  });
```

We are not going to discuss development settings here, information about it can be obtained directly from the [source code](https://github.com/dhilt/ngx-ui-scroll/blob/master/src/component/classes/settings.ts), but the uiScroll has "debug" mode with powerful logging which can be enabled via `devSettings.debug = true`. Also, with `devSettings.immediateLog = false` the console logging will be postponed until the undocumented Adapter method `showLog` is called (`datasource.adapter.showLog()`). This case could be important from the performance view: there might be too many logs and pushing them to the console output immediately could slow down the App.

The work has just begun. We have great plans and any participation is welcome! So, feel free to submit new issues and open Pull Requests.

__________

2018 &copy; dhilt, [Hill30 Inc](http://www.hill30.com/)
