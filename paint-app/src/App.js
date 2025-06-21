import { useEffect, useRef, useState } from "react";
import Menu from "./components/Menu";
import "./App.css";

function App() {
    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("black");
    const [lineOpacity, setLineOpacity] = useState(1);
    const [tool, setTool] = useState("brush");
    const [lineType, setLineType] = useState("solid");
    const [shape, setShape] = useState("rectangle");
    const [startPos, setStartPos] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
    const [suggestedShapes, setSuggestedShapes] = useState([]);

    const history = useRef([]);
    const redoStack = useRef([]);

    // Set canvas size based on screen width
    useEffect(() => {
        const updateCanvasSize = () => {
            const width = Math.min(window.innerWidth - 40, 1280);
            const height = width * 0.5625; // 16:9 ratio
            setCanvasSize({ width, height });
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    // Initialize canvas context
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(lineType === "dashed" ? [10, 5] : []);
        ctxRef.current = ctx;

        // Push blank initial state
        if (history.current.length === 0) {
            history.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        }
    }, [lineColor, lineOpacity, lineWidth, lineType, canvasSize]);

    const saveState = () => {
        const canvas = canvasRef.current;
        history.current.push(ctxRef.current.getImageData(0, 0, canvas.width, canvas.height));
        redoStack.current = [];
    };

    const undo = () => {
        if (history.current.length > 1) {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            redoStack.current.push(history.current.pop());
            ctx.putImageData(history.current[history.current.length - 1], 0, 0);
        }
    };

    const redo = () => {
        if (redoStack.current.length > 0) {
            const canvas = canvasRef.current;
            const ctx = ctxRef.current;
            const imageData = redoStack.current.pop();
            history.current.push(imageData);
            ctx.putImageData(imageData, 0, 0);
        }
    };

    const downloadImage = () => {
        const link = document.createElement("a");
        link.download = "paint-drawing.png";
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    const startDrawing = (e) => {
        const { offsetX, offsetY } = e.nativeEvent;
        setStartPos({ x: offsetX, y: offsetY });

        if (tool === "text") {
            const input = prompt("Enter text:");
            if (input) {
                ctxRef.current.font = `${lineWidth * 4}px sans-serif`;
                ctxRef.current.fillStyle = lineColor;
                ctxRef.current.fillText(input, offsetX, offsetY);
                saveState();
            }
            return;
        }

        ctxRef.current.beginPath();
        ctxRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "brush") {
            ctxRef.current.strokeStyle = lineColor;
            ctxRef.current.lineTo(offsetX, offsetY);
            ctxRef.current.stroke();
        } else if (tool === "eraser") {
            ctxRef.current.strokeStyle = "white";
            ctxRef.current.lineTo(offsetX, offsetY);
            ctxRef.current.stroke();
        }
    };

    const endDrawing = (e) => {
        if (!isDrawing) return;
        setIsDrawing(false);
        ctxRef.current.closePath();

        const { offsetX, offsetY } = e.nativeEvent;

        if (tool === "shape" && startPos) {
            const ctx = ctxRef.current;
            ctx.beginPath();
            ctx.strokeStyle = lineColor;

            const width = offsetX - startPos.x;
            const height = offsetY - startPos.y;

            if (shape === "rectangle") {
                ctx.strokeRect(startPos.x, startPos.y, width, height);
            } else if (shape === "circle") {
                const radius = Math.sqrt(width ** 2 + height ** 2);
                ctx.arc(startPos.x, startPos.y, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
        }

        

        saveState();
    };

    return (
        <div className="App">
            <h1>Advanced Paint App</h1>
            <div className="draw-area">
                <Menu
                    setLineColor={setLineColor}
                    setLineWidth={setLineWidth}
                    setLineOpacity={setLineOpacity}
                    setTool={setTool}
                    setLineType={setLineType}
                    setShape={setShape}
                    undo={undo}
                    redo={redo}
                    downloadImage={downloadImage}
                />
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseUp={endDrawing}
                    onMouseMove={draw}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="canvas"
                />
            </div>
        </div>
    );
}

export default App;
