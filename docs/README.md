# Flowy

![Demo](flowy.gif)
<br>A javascript library to create pretty flowcharts with ease ✨

[Live demo](https://denysvuika.github.io/flowy)

Flowy makes creating WebApps with flowchart functionality an incredibly simple task.
Build automation software, mind mapping tools, or simple programming platforms in minutes by implementing the library into your project.

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Running Flowy](#running-flowy)
  - [Initialization](#initialization)
  - [Example](#example)
- [Methods](#methods)
  - [Get the flowchart data](#get-the-flowchart-data)
  - [Delete all blocks](#delete-all-blocks)

## Features

Currently, Flowy supports the following:

- Responsive drag and drop
- Automatic snapping
- Block rearrangement
- Delete blocks
- Automatic block centering

You can try out [the demo](https://denysvuika.github.io/flowy) to see the library in action.

## Installation

Adding Flowy to your WebApp is incredibly simple:

1. Include `jQuery` to your project
2. Link `https://unpkg.com/@denysvuika/flowy` to your project

```html
<script src="https://unpkg.com/@denysvuika/flowy"></script>
```

### Installing via NPM

With NPM:

```sh
npm install @denysvuika/flowy
```

With Yarn:

```sh
yarn add @denysvuika/flowy
```

## Running Flowy

### Initialization

```javascript
flowy(canvas, ongrab, onrelease, onsnap, spacing_x, spacing_y);
```

| Parameter   | Type                  | Description                                                      |
| ----------- | --------------------- | ---------------------------------------------------------------- |
| `canvas`    | _jQuery object_       | The element that will contain the blocks                         |
| `ongrab`    | _function_ (optional) | Function that gets triggered when a block is dragged             |
| `onrelease` | _function_ (optional) | Function that gets triggered when a block is released            |
| `onsnap`    | _function_ (optional) | Function that gets triggered when a block snaps with another one |
| `spacing_x` | _integer_ (optional)  | Horizontal spacing between blocks (default 20px)                 |
| `spacing_Y` | _integer_ (optional)  | Vertical spacing between blocks (default 80px)                   |

To define the blocks that can be dragged, you need to add the class `.create-flowy`

### Example

#### HTML

```html
<div class="create-flowy">The block to be dragged</div>
<div id="canvas"></div>
```

#### Javascript

```javascript
var spacing_x = 40;
var spacing_y = 100;

// Initialize Flowy
flowy($('#canvas'), onGrab, onRelease, onSnap, spacing_x, spacing_y);

function onGrab() {
  // When the user grabs a block
}
function onRelease() {
  // When the user releases a block
}
function onSnap() {
  // When a block snaps with another one
}
```

## Methods

### Get the flowchart data

```javascript
// As an object
flowy.output();
// As a JSON string
JSON.stringify(flowy.output());
```

The JSON object that gets outputted looks like this:

```javascript
{
  "id": 1,
  "parent": 0,
  "data": [
    {
      "name": "blockid",
      "value": "1"
    }
  ]
}
```

Here's what each property means:

| Key      | Value type         | Description                                                                      |
| -------- | ------------------ | -------------------------------------------------------------------------------- |
| `id`     | _integer_          | Unique value that identifies a block                                             |
| `parent` | _integer_          | The `id` of the parent a block is attached to (-1 means the block has no parent) |
| `data`   | _array of objects_ | An array of all the inputs within the selected block                             |
| `name`   | _string_           | The name attribute of the input                                                  |
| `value`  | _string_           | The value attribute of the input                                                 |

### Delete all blocks

To remove all blocks at once use:

```javascript
flowy.deleteBlocks();
```

Currently there is no method to individually remove blocks. The only way to go about it is by splitting branches manually.

## Developing

You can use the following scripts with `npm run <script>` or `yarn <script>` commands:

| script     | description                                       |
| ---------- | ------------------------------------------------- |
| build      | build the library to the `/dist` output folder    |
| start      | run the demo app (requires `build`)               |
| build-docs | build the `docs` folder for the live demo         |
| start-docs | runs the live demo locally from the `docs` folder |

## License

MIT

Copyright for portions of project [DenysVuika/flowy](https://github.com/DenysVuika/flowy) are held by [Alyssa X](https://alyssax.com), 2019 as part of project [alyssaxuu/flowy](https://github.com/alyssaxuu/flowy).

All other copyright for project [DenysVuika/flowy](https://github.com/DenysVuika/flowy) are held by Denys Vuika, 2019.
