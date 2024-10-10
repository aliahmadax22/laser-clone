import type { Canvas } from 'fabric';

interface HistoryEvent {
  json: string;
}

export class HistoryEventHelper {
  private canvas: Canvas;
  private history: HistoryEvent[] = [];
  private redoHistory: HistoryEvent[] = [];
  private propertiesToInclude: string[] = [];
  private historyLimit: number;
  private historyProcessing: boolean = false; // Flag to ignore events during undo/redo

  constructor(canvas: Canvas, historyLimit: number = 50) {
    this.canvas = canvas;
    this.propertiesToInclude = ['selectable', 'editable', 'padding', 'visible', 'id'];
    this.historyLimit = historyLimit;
    this.init();
  }

  private init() {
    this.canvas.on('object:added', this.saveHistory.bind(this));
    this.canvas.on('object:modified', this.saveHistory.bind(this));
    this.canvas.on('object:removed', this.saveHistory.bind(this));
    this.canvas.on('object:skewing', this.saveHistory.bind(this));
  }

  private saveHistory() {
    if (this.historyProcessing) return;
    if (this.history.length >= this.historyLimit) {
      this.history.shift(); // Remove the oldest history event
    }
    this.history.push({ json: this.canvas.toDatalessJSON(this.propertiesToInclude) });
    this.redoHistory = []; // Clear redo history on new changes
  }

  public undo() {
    // The undo process will render the new states of the objects
    // Therefore, object:added and object:modified events will triggered again
    // To ignore those events, we are setting a flag.
    this.historyProcessing = true;
    if (this.history.length > 1) {
      const lastHistory = this.history.pop();
      if (lastHistory) {
        this.redoHistory.push(lastHistory);
      }
      const previousHistory = this.history[this.history.length - 1];

      this.canvas.loadFromJSON(previousHistory.json).then( ()=>{
        this.historyProcessing = false;
        this.canvas.renderAll();
      });
    }
  }

  public redo() {
    // The undo process will render the new states of the objects
    // Therefore, object:added and object:modified events will triggered again
    // To ignore those events, we are setting a flag.
    this.historyProcessing = true;
    if (this.redoHistory.length > 0) {
      const redoHistoryEvent = this.redoHistory.pop();
      if (redoHistoryEvent) {
        this.history.push(redoHistoryEvent);
        this.canvas.loadFromJSON(redoHistoryEvent.json).then(() => {
          this.canvas.renderAll();
          this.historyProcessing = false;
        });
      }
    }
  }

  public clearHistory() {
    this.history = [];
    this.redoHistory = [];
    this.saveHistory(); // Save the current state
  }

  
}


export default HistoryEventHelper;
