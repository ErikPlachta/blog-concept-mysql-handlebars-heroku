# A Tech Blog Concept App

## https://erikplachta.herokuapp.com/login

## 02/12/2022 #EP | Actively under Development

A Tech Blog concept app hosted on the cloud. Fully built out MVC with JawsDB database, Node - Express.js API server, using Sequelize as an ORM, and Handlebars to build content dynamically.

 > I've built this app to demonstrate how a modular design built on the MVC framework can accomplish a lot with little.

## Concept

## About

**TODO:: 02/12/2022 #EP | Fill out.**

## Useage

**TODO:: 02/12/2022 #EP | Fill out.**

---

## Contirbutors

### Erik Plachta

 **TODO:: 02/12/2022 #EP | Fill out.**


### Outside Contributions

**TODO:: 02/12/2022 #EP | Fill out.**

---

## Program Architecture

### Model - JawsDB

#### **Database: x**

**TODO:: 02/12/2022 #EP | Fill out.**

#### **Table: x**

**TODO:: 02/12/2022 #EP | Fill out.**

#### **Table: x**

**TODO:: 02/12/2022 #EP | Fill out.**

---

### View - Handlebars

TODO:: add context.

---

### Controller - Node - Express.js

TODO:: add context.


---

## Bootstrap Markdown

#Info

I've added some options, methods and events that fixes some issues submitted by other users and also enhances the plugin.

**Added events:**

- ***onChange*** - This will trigger every time you typed in anything on the ```textarea```. The event is triggered by ```keyup```, ```callbacks``` from each menu buttons and native ```textarea.on('change', ... )``` event

**Added methods:**

- ***hideButtons(name)*** - Completely hide the specified ```buttons``` by name. Using ```hidden``` class in boostrap.
- ***showButtons(name)*** - Opposite to ```hideButtons()```
- ***parseContent()*** - Parsing the content is now separated, so you can always call this function to parse the ```textarea``` content. 

**Enhancement:**

- On ```showButtons```, ```hideButtons```, ```disableButtons``` and ```enableButtons``` methods, the ```name``` parameter can now be either an ```array``` or ```string```

**Fixes:**

- I've noticed on the current version, ```keyup``` is triggering ***3x*** because of ```keypress``` and ```keydown``` events. I've commented these lines to avoid redundancy of ```keyup``` trigger.

##Update 2##

Few additional options and [jquery hotkeys](https://github.com/jeresig/jquery.hotkeys) support too.

**New Options:**
 - **footer** - You can now write your own footer content together with the `save` button (if available)
 - **hiddenButtons** - `array` or `string` of button names to be hidden (called via `hideButtons(...)` method)
 - **disabledButtons** - `array` or `string` of button names to be disabled (called via `disableButtons(...)` method

**New Buttons**
 - **Ordered List `cmdListO (Ctrl+O)`** - Using numeric instead of hyphen `-`
 - **Code `cmdCode (Ctrl+K)`** - Button for `code` block
 - **Quote  `cmdQuote (Ctrl+Q)`** - Button for `quote` block

**jquery hotkeys support**
[https://github.com/jeresig/jquery.hotkeys](https://github.com/jeresig/jquery.hotkeys)
I've added the support for jquery hotkeys so user can assign a hotkey for each buttons (new property `hotkey` in the buttons object). Default buttons has already default hotkeys.