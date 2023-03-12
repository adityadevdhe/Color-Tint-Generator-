"use strict";
//This plugin will create tints of chosen color
//The elements will be placed in a frame in auto layout
//The ui will allow users to pick the original color give the color name how many tints to generate
//the distance between copies 
figma.showUI(__html__, { width: 320, height: 640, title: 'Color tint generator' });
//Message received
figma.ui.onmessage = msg => {
    if (msg.type === 'actionGenerate') {
        //Destructure the form data
        const { circleSize, circleSpacing, colorCode, colorName, frameDirection, tintNumber } = msg.formDataObj;
        //Crating frame
        const parentFrame = figma.createFrame();
        parentFrame.name = 'Tints for the ' + colorName + 'color';
        //Add auto layout
        parentFrame.layoutMode = frameDirection.toUpperCase();
        parentFrame.paddingLeft = 64;
        parentFrame.paddingRight = 64;
        parentFrame.paddingBottom = 64;
        parentFrame.paddingTop = 64;
        parentFrame.itemSpacing = parseInt(circleSpacing);
        parentFrame.primaryAxisSizingMode = 'AUTO';
        parentFrame.counterAxisSizingMode = 'AUTO';
        //Generate tints
        for (let i = 0; i < tintNumber; ++i) {
            const tintNode = figma.createEllipse();
            tintNode.name = colorName + ' ' + (100 - i * 10);
            //size the layer
            tintNode.resize(parseInt(circleSize), parseInt(circleSize));
            const hexToRgb = (hex) => {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            const colorR = hexToRgb(colorCode).r / 255, colorG = hexToRgb(colorCode).g / 255, colorB = hexToRgb(colorCode).b / 255;
            console.log(colorR, colorG, colorB);
            //color the layer
            tintNode.fills = [{ type: 'SOLID', color: { r: colorR, g: colorG, b: colorB } }];
            //set layer opacity
            tintNode.opacity = (100 - i * 10) / 100;
            //add generated nodes to parent frame
            parentFrame.appendChild(tintNode);
            //select and zoom to generated frame
            const selectFrame = [];
            selectFrame.push(parentFrame);
            figma.currentPage.selection = selectFrame;
            figma.viewport.scrollAndZoomIntoView(selectFrame);
        }
        figma.closePlugin('Tints genrated successfully');
    }
    else if (msg.type === 'actionExit') {
        figma.closePlugin();
    }
};
//figma.closePlugin()
