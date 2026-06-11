import { useEffect, useRef, useState, MouseEvent } from 'react';

// Define structures for our drawing actions to manage Undo/Redo
interface DrawLine {
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  tool: 'pen' | 'highlighter' | 'eraser';
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(5);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');

  // History states for Undo/Redo tracking
  const [history, setHistory] = useState<DrawLine[]>([]);
  const [redoStack, setRedoStack] = useState<DrawLine[]>([]);
  const currentLine = useRef<{ x: number; y: number }[]>([]);

  // Initialize Canvas configurations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI displays (retina screens) to make lines crisp, not blurry
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    
    context.scale(2, 2);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    contextRef.current = context;

    // Redraw everything if the canvas mounts/wipes
    redrawCanvas(history);
  }, []);

  // Utility function to redraw the entire canvas based on action history array
  const redrawCanvas = (linesToDraw: DrawLine[]) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (!context || !canvas) return;

    // Clear canvas frame back to dark slate background
    context.clearRect(0, 0, canvas.width, canvas.height);

    linesToDraw.forEach((line) => {
      if (line.points.length === 0) return;
      
      context.beginPath();
      context.lineWidth = line.lineWidth;
      
      if (line.tool === 'eraser') {
        context.strokeStyle = '#151515'; // Match background color to simulate erasing
        context.globalAlpha = 1.0;
      } else if (line.tool === 'highlighter') {
        context.strokeStyle = line.color;
        context.globalAlpha = 0.4; // Semi-transparent overlay effect
      } else {
        context.strokeStyle = line.color;
        context.globalAlpha = 1.0;
      }

      context.moveTo(line.points[0].x, line.points[0].y);
      for (let i = 1; i < line.points.length; i++) {
        context.lineTo(line.points[i].x, line.points[i].y);
      }
      context.stroke();
      context.closePath();
    });
    
    // Reset alpha back to normal default
    context.globalAlpha = 1.0;
  };

  // Start Action Event Handler
  const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    if (!context) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    context.beginPath();
    context.moveTo(x, y);
    
    // Set dynamic engine values based on selected tool properties
    context.lineWidth = lineWidth;
    if (tool === 'eraser') {
      context.strokeStyle = '#151515';
      context.globalAlpha = 1.0;
    } else if (tool === 'highlighter') {
      context.strokeStyle = color;
      context.globalAlpha = 0.4;
    } else {
      context.strokeStyle = color;
      context.globalAlpha = 1.0;
    }

    currentLine.current = [{ x, y }];
    setIsDrawing(true);
  };

  // Drawing Event Handler
  const draw = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();

    currentLine.current.push({ x, y });
  };

  // Finish Action Event Handler
  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    contextRef.current?.closePath();

    // Commit line to layout history array tracking structure
    const newLine: DrawLine = {
      points: currentLine.current,
      color: color,
      lineWidth: lineWidth,
      tool: tool,
    };

    const updatedHistory = [...history, newLine];
    setHistory(updatedHistory);
    setRedoStack([]); // Clear redo stack on a brand new stroke action
    currentLine.current = [];
  };

  // Undo Function
  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    const updatedHistory = history.slice(0, -1);
    
    setHistory(updatedHistory);
    setRedoStack([previous, ...redoStack]);
    redrawCanvas(updatedHistory);
  };

  // Redo Function
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextLine = redoStack[0];
    const updatedRedo = redoStack.slice(1);

    const updatedHistory = [...history, nextLine];
    setHistory(updatedHistory);
    setRedoStack(updatedRedo);
    redrawCanvas(updatedHistory);
  };

  // Clear Canvas Entirely
  const clearCanvas = () => {
    setHistory([]);
    setRedoStack([]);
    const context = contextRef.current;
    const canvas = canvasRef.current;
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#121212', color: 'white' }}>
      
      {/* Dynamic Controls Header Toolbar */}
      <div style={{ display: 'flex', gap: '15px', padding: '15px', background: '#1e1e1e', alignItems: 'center', borderBottom: '1px solid #333', flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#3b82f6' }}>SketchPad Pro</h2>
        
        {/* Tool Selectors */}
        <div style={{ display: 'flex', gap: '4px', background: '#2a2a2a', padding: '4px', borderRadius: '6px' }}>
          {(['pen', 'highlighter', 'eraser'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              style={{
                padding: '6px 12px',
                background: tool === t ? '#3b82f6' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Color Picker (Hide if using eraser) */}
        {tool !== 'eraser' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
              style={{ border: 'none', background: 'none', cursor: 'pointer', width: '35px', height: '35px' }}
            />
          </div>
        )}

        {/* Brush Size Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#aaa' }}>Size: {lineWidth}px</span>
          <input 
            type="range" 
            min="1" 
            max="40" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(Number(e.target.value))}
            style={{ cursor: 'pointer' }}
          />
        </div>

        {/* Undo, Redo & Clear Buttons */}
        <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
          <button 
            onClick={handleUndo} 
            disabled={history.length === 0}
            style={{ padding: '8px 12px', background: history.length === 0 ? '#333' : '#444', color: history.length === 0 ? '#777' : '#fff', border: 'none', borderRadius: '4px', cursor: history.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            ↩ Undo
          </button>
          <button 
            onClick={handleRedo} 
            disabled={redoStack.length === 0}
            style={{ padding: '8px 12px', background: redoStack.length === 0 ? '#333' : '#444', color: redoStack.length === 0 ? '#777' : '#fff', border: 'none', borderRadius: '4px', cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer' }}
          >
            ↪ Redo
          </button>
          <button 
            onClick={clearCanvas} 
            style={{ padding: '8px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* The HTML5 Interactive Freehand Drawing Canvas */}
      <div style={{ flex: 1, position: 'relative', background: '#151515' }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
}