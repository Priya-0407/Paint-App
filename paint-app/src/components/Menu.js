import React from "react";
import "../App.css";

const Menu = ({
    setLineColor,
    setLineWidth,
    setLineOpacity,
    setTool,
    setLineType,
    setShape,
    undo,
    redo,
    downloadImage
}) => {
    return (
        <div className="Menu">
            <label>Color</label>
            <input type="color" onChange={(e) => setLineColor(e.target.value)} />

            <label>Width</label>
            <input type="range" min="1" max="20" onChange={(e) => setLineWidth(e.target.value)} />

            <label>Opacity</label>
            <input type="range" min="1" max="100" onChange={(e) => setLineOpacity(e.target.value / 100)} />

            <label>Tool</label>
            <select onChange={(e) => setTool(e.target.value)}>
                <option value="brush">Brush</option>
                <option value="eraser">Eraser</option>
                <option value="text">Text</option>
                <option value="shape">Shape</option>
            </select>

            <label>Line</label>
            <select onChange={(e) => setLineType(e.target.value)}>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
            </select>

            <label>Shape</label>
            <select onChange={(e) => setShape(e.target.value)}>
                <option value="rectangle">Rectangle</option>
                <option value="circle">Circle</option>
            </select>

            <button onClick={undo}>Undo</button>
            <button onClick={redo}>Redo</button>
            <button onClick={downloadImage}>Save</button>
        </div>
    );
};

export default Menu;
