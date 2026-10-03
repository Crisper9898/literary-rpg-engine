/** Six authored poses sampled by travel distance, not a wall-clock animation. */
export class JourneyWalkCycle {
  private travelled = 0;
  constructor(private readonly cycleDistance = 132) {}

  advance(distance: number) {
    const moving = Number.isFinite(distance) && distance > .05;
    if (!moving) { this.travelled = 0; return { moving: false, frame: 0, lift: 0, sway: 0 }; }
    this.travelled = (this.travelled + distance) % this.cycleDistance;
    const wave = Math.sin(this.travelled / this.cycleDistance * Math.PI * 2);
    return { moving: true, frame: Math.floor(this.travelled * 6 / this.cycleDistance),
      lift: -Math.abs(wave) * .75, sway: wave * .008 };
  }
}
