/**
 * Mobile Navigation Utilities für 3D Gallery
 */

export interface TouchGesture {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  deltaX: number;
  deltaY: number;
  distance: number;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

/**
 * Touch Gesture Handler für Gallery Navigation
 */
export class TouchGestureHandler {
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private touchEndX: number = 0;
  private touchEndY: number = 0;
  private minSwipeDistance: number = 50;

  constructor(minSwipeDistance: number = 50) {
    this.minSwipeDistance = minSwipeDistance;
  }

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  handleTouchMove(event: TouchEvent): void {
    this.touchEndX = event.touches[0].clientX;
    this.touchEndY = event.touches[0].clientY;
  }

  handleTouchEnd(): TouchGesture | null {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < this.minSwipeDistance) {
      return null;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    let direction: TouchGesture['direction'] = null;

    if (absX > absY) {
      // Horizontal swipe
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      // Vertical swipe
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      startX: this.touchStartX,
      startY: this.touchStartY,
      endX: this.touchEndX,
      endY: this.touchEndY,
      deltaX,
      deltaY,
      distance,
      direction,
    };
  }

  reset(): void {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }
}

/**
 * Virtual Joystick für Mobile-Steuerung
 */
export class VirtualJoystick {
  private baseX: number = 0;
  private baseY: number = 0;
  private stickX: number = 0;
  private stickY: number = 0;
  private maxDistance: number = 50;
  private active: boolean = false;

  constructor(maxDistance: number = 50) {
    this.maxDistance = maxDistance;
  }

  start(x: number, y: number): void {
    this.baseX = x;
    this.baseY = y;
    this.stickX = x;
    this.stickY = y;
    this.active = true;
  }

  move(x: number, y: number): { x: number; y: number; distance: number } {
    if (!this.active) return { x: 0, y: 0, distance: 0 };

    const deltaX = x - this.baseX;
    const deltaY = y - this.baseY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > this.maxDistance) {
      const angle = Math.atan2(deltaY, deltaX);
      this.stickX = this.baseX + Math.cos(angle) * this.maxDistance;
      this.stickY = this.baseY + Math.sin(angle) * this.maxDistance;
    } else {
      this.stickX = x;
      this.stickY = y;
    }

    const normalizedX = (this.stickX - this.baseX) / this.maxDistance;
    const normalizedY = (this.stickY - this.baseY) / this.maxDistance;

    return {
      x: normalizedX,
      y: normalizedY,
      distance: Math.min(distance, this.maxDistance) / this.maxDistance,
    };
  }

  end(): void {
    this.active = false;
  }

  isActive(): boolean {
    return this.active;
  }

  getPosition(): { baseX: number; baseY: number; stickX: number; stickY: number } {
    return {
      baseX: this.baseX,
      baseY: this.baseY,
      stickX: this.stickX,
      stickY: this.stickY,
    };
  }
}
