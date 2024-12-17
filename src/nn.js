//import {visor,show,metrics,render} from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

import { MnistData } from './data.js';

export async function showExamples(data) {
    // Create a container in the visor
    const surface =
        tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data' });

    // Get the examples
    const examples = data.nextTestBatch(20);
    const numExamples = examples.xs.shape[0];

    // Create a canvas element to render each example
    for (let i = 0; i < numExamples; i++) {
        const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
                .slice([i, 0], [1, examples.xs.shape[1]])
                .reshape([28, 28, 1]);
        });

        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        canvas.style = 'margin: 4px;';
        await tf.browser.toPixels(imageTensor, canvas);
        surface.drawArea.appendChild(canvas);

        imageTensor.dispose();
    }
}

export async function run() {
    const data = new MnistData();
    await data.load();
    await showExamples(data);

    const model = getModel();
    tfvis.show.modelSummary({ name: 'Model Architecture', tab: 'Model' }, model);
    await train(model, data);
    await showAccuracyAndConfusion(model, data);
}

//document.addEventListener('DOMContentLoaded', run);

/*Code für Modellarchitektur*/

function getModel() {
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

    // Hidden Layer
    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));

    // Output Layer mit 10 Units (für die Ziffern 0-9)
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

    return model;
}

/*Modell trainieren*/
export async function train(model, data) {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
        name: 'Model Training', tab: 'Model', styles: { height: '1000px' }
    };
    const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

    const BATCH_SIZE = 512;
    const TRAIN_DATA_SIZE = 5500;
    const TEST_DATA_SIZE = 1000;

    const [trainXs, trainYs] = tf.tidy(() => {
        const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
        // Hier flatten wir die Eingabedaten
        return [
            d.xs.reshape([TRAIN_DATA_SIZE, 784]), // 28*28*1 = 784
            d.labels
        ];
    });

    const [testXs, testYs] = tf.tidy(() => {
        const d = data.nextTestBatch(TEST_DATA_SIZE);
        // Auch hier flatten wir die Testdaten
        return [
            d.xs.reshape([TEST_DATA_SIZE, 784]),
            d.labels
        ];
    });

    return model.fit(trainXs, trainYs, {
        batchSize: BATCH_SIZE,
        validationData: [testXs, testYs],
        epochs: 10,
        shuffle: true,
        callbacks: fitCallbacks
    });
}

/*Modelltest*/
export const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

export function doPrediction(model, data, testDataSize = 500) {
    const testData = data.nextTestBatch(testDataSize);
    const testxs = testData.xs.reshape([testDataSize, 784]); // Flatten auf 784
    const labels = testData.labels.argMax(-1);
    const preds = model.predict(testxs).argMax(-1);

    testxs.dispose();
    return [preds, labels];
}

export async function showAccuracyAndConfusion(model, data) {
    const [preds, labels] = doPrediction(model, data);
    const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
    const containerAccuracy = { name: 'Accuracy', tab: 'Evaluation' };
    tfvis.show.perClassAccuracy(containerAccuracy, classAccuracy, classNames);

    const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
    const containerConfusionMatrix = { name: 'Confusion Matrix', tab: 'Evaluation' };
    tfvis.render.confusionMatrix(containerConfusionMatrix, { values: confusionMatrix, tickLabels: classNames });


    labels.dispose();
};
