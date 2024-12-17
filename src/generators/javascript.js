/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['nn'] = function (block, generator) {
  var code = `nn.run()`;
  return code;
};

forBlock['layers'] = function (block, generator) {
  const statementInput = generator.statementToCode(block, 'inputLayers');
  var code = 
  `
  const model = tf.sequential();
    
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;
  const FLATTEN_INPUT_SIZE = IMAGE_WIDTH * IMAGE_HEIGHT * IMAGE_CHANNELS;

  // Erste Dense Layer mit der flatten Input Shape
  model.add(tf.layers.dense({
      inputShape: [FLATTEN_INPUT_SIZE],
      units: 128,
      activation: 'relu',
      kernelInitializer: 'varianceScaling'
  }));
  `;  //defines the model and the input shape
  code += statementInput;

  code +=
  `
  const NUM_OUTPUT_CLASSES = 10;
    model.add(tf.layers.dense({
        units: NUM_OUTPUT_CLASSES,
        activation: 'softmax'
    }));

  const optimizer = tf.train.adam();
  model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
  });
  `;  //defines the output shape of the model and the activation function

  return code;
};

forBlock['denseLayer'] = function (block, generator) {
  const numberInput = block.getFieldValue('neurons') || '0';
  var code =
  `
model.add(tf.layers.dense({
    units: ${numberInput},
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
}));
  `;

  return code;
};

forBlock['run'] = function (block, generator) {
  const statementInput = generator.statementToCode(block, 'model');
  var code =
  `
  (async () => {
    const mnistData = new data.MnistData();
    await mnistData.load();
    await nn.showExamples(mnistData);
  `;
  code += statementInput;

  code +=
  `
  tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);
  await nn.train(model, mnistData);
  await nn.showAccuracyAndConfusion(model, mnistData);
  })();
  `;


  return code;
};

forBlock['drawing_canvas'] = function (block, generator) {
  var code = `
  (function() {
    var canvas = document.getElementById('drawingCanvas');

    var ctx = canvas.getContext('2d');
    var drawing = false;

    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.fillsyle = "black";

    clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    canvas.addEventListener('mousedown', function(e) {
      drawing = true;
      ctx.beginPath();
      ctx.moveTo(e.offsetX, e.offsetY);
    });

    canvas.addEventListener('mousemove', function(e) {
      if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }
    });

    canvas.addEventListener('mouseup', function() {
      drawing = false;
    });

    canvas.addEventListener('mouseout', function() {
      drawing = false;
    });
  })();
`;
return code;
};

