/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

const fullNN =
{
  "type": "nn",
  "tooltip": "",
  "helpUrl": "",
  "message0": "nn %1",
  "args0": [
    {
      "type": "input_dummy",
      "name": "dummy"
    },
  ],
  "colour": 225
}

const layers =
{
  "type": "layers",
  "tooltip": "",
  "helpUrl": "",
  "message0": "Layer %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "inputLayers"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 225
}

const denseLayer =
{
  "type": "denseLayer",
  "message0": "denseLayer %1",
  "args0": [
    {
      "type": "field_number",
      "name": "neurons",
      "value": 0,
      "check": "Number",
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": 225,
  "tooltip": "",
  "helpUrl": "",
};

const run =
{
  "type": "run",
  "tooltip": "",
  "helpUrl": "",
  "message0": "run %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "model"
    }
  ],
  "colour": 225
}

const drawing_canvas = 
{
  "type": "drawing_canvas",
  "message0": "Drawing Canvas %1",
  "args0": [
    {
      "type": "input_dummy",
      //"width": 200,
      //"height": 200
    }
  ],
  "colour": 160,
  "tooltip": "A block with an embedded canvas for drawing.",
  "helpUrl": ""
}                 

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  fullNN,layers,denseLayer,run,drawing_canvas
]);
