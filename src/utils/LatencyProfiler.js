/**
 * Latency Profiler Utility
 * Singleton to track performance metrics across the application.
 */
class LatencyProfiler {
  constructor() {
    this.metrics = [];
    this.marks = new Map();
    this.listeners = [];
  }

  /**
   * Start a timer for a specific label.
   * @param {string} label - Unique identifier for the operation.
   */
  start(label) {
    this.marks.set(label, performance.now());
  }

  /**
   * End a timer and record the duration.
   * @param {string} label - The label used in start().
   * @param {object} metadata - Optional extra data (e.g., text length).
   */
  end(label, metadata = {}) {
    if (!this.marks.has(label)) {
      console.warn(`LatencyProfiler: No start mark for '${label}'`);
      return;
    }
    const startTime = this.marks.get(label);
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.log(label, { ...metadata, duration: duration.toFixed(2) });
    this.marks.delete(label);
  }

  /**
   * Log a specific event or metric directly.
   * @param {string} name - Name of the event.
   * @param {object} data - Data to store.
   */
  log(name, data = {}) {
    const entry = {
      name,
      timestamp: new Date().toISOString(),
      ...data
    };
    this.metrics.push(entry);
    this.notifyListeners();
    // Console log for immediate debugging
    console.log(`[Latency] ${name}:`, data);
  }

  /**
   * Get all recorded metrics.
   */
  getReport() {
    return this.metrics;
  }

  /**
   * Clear all metrics.
   */
  clear() {
    this.metrics = [];
    this.marks.clear();
    this.notifyListeners();
  }

  /**
   * Subscribe to updates (for UI).
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this.metrics));
  }
}

export const profiler = new LatencyProfiler();
