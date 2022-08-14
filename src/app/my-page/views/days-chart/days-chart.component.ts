import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

export interface IValue {
  label: string,
  value: number
}

export interface IStats {
  name: string,
  maxValue: number,
  values: IValue[]
}

export interface IPadding {
  left: number,
  top: number,
  right: number,
  bottom: number,
}

export interface ICanvasInfo {
  grid: IPadding,
  curve: IPadding,
  W: number, H: number
}

@Component({
  selector: 'app-days-chart',
  templateUrl: './days-chart.component.html',
  styleUrls: ['./days-chart.component.sass']
})
export class DaysChartComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D|null = null;
  @Input('stats') stats!: IStats
  labelVisible = false;
  currentValue: IValue = {label: '', value: 0};
  private readonly defaultPadding = {top: 0, bottom: 0, right: 0, left: 0};
  private canvasInfo: ICanvasInfo = {W: 0, H: 0, grid: this.defaultPadding, curve : this.defaultPadding};
  private xStep: number = 1;
  private yStep: number = 1;
  private labelX: number = 0;
  private readonly ratio = window.devicePixelRatio || 1;

  constructor() { }

  ngOnInit(): void {
    this.drawChart(this.canvas, this.stats);
  }

  @HostListener('window:resize')
  public redraw(): void {
    this.drawChart(this.canvas, this.stats);
    this.labelVisible = false;
  }

  public drawChart(canvas: ElementRef<HTMLCanvasElement>, stats: IStats): void {
    const rect = canvas.nativeElement.getBoundingClientRect();
    const W = canvas.nativeElement.width = rect.width * this.ratio;
    const H = canvas.nativeElement.height = rect.height * this.ratio;
    const ctx = this.ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    const padding = W / 50 + H / 100;
    this.canvasInfo = {
      W, H,
      grid: {top: padding, bottom: padding, right: padding, left: padding * 2 + 4},
      curve: {top: padding * 1.5, bottom: padding * 1.5, right: padding * 1.5, left: padding * 2.5 + 4},
    }
    this.xStep = (this.canvasInfo.W - this.canvasInfo.curve.left - this.canvasInfo.curve.right) / (stats.values.length - 1);
    this.yStep = (this.canvasInfo.H - this.canvasInfo.curve.top - this.canvasInfo.curve.bottom) / (stats.maxValue - 1);
    ctx.fillStyle = '#22222e'
    ctx.fillRect(0 , 0, W, H);
    this.drawGrid(ctx, stats, this.canvasInfo);
    this.drawCurve(ctx, stats, this.canvasInfo);
  }

  private drawCurve(ctx: CanvasRenderingContext2D, stats: IStats, info: ICanvasInfo): void {
    ctx.beginPath();
    ctx.strokeStyle = '#d09f2a';
    ctx.lineCap = 'round';
    ctx.lineWidth = 1 + info.W / 390;
    ctx.moveTo(info.curve.left, info.H - info.curve.bottom - stats.values[0].value * this.yStep);
    for (let i = 1; i < stats.values.length; i++) {
      ctx.lineTo(info.curve.left + this.xStep * i, info.H - info.curve.bottom - stats.values[i].value * this.yStep);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.fillStyle = '#d09f2a';
    const pointSize = 1.8 + info.W / 250;
    let v;
    ctx.beginPath();
    for (let i = 0; i < stats.values.length; i++) {
      v = stats.values[i];
      ctx.moveTo(info.curve.left + i * this.xStep, info.H - info.curve.bottom - v.value * this.yStep);
      ctx.arc(info.curve.left + i * this.xStep, info.H - info.curve.bottom - v.value * this.yStep, pointSize,0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
  }

  private drawCurrentValue(ctx: CanvasRenderingContext2D, info: ICanvasInfo): void {
    ctx.strokeStyle = '#5c5c5c'
    ctx.lineWidth = 1;
    ctx.setLineDash([1, 4]);
    ctx.beginPath();
    ctx.moveTo(this.labelX, info.H - info.grid.bottom);
    ctx.lineTo(this.labelX, info.grid.top);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    const y = info.H - info.curve.bottom - this.currentValue.value * this.yStep;
    const pointSize = 2 + info.W / 170;
    this.drawPoint(ctx, this.labelX, y, pointSize * 1.2, '#1010155d');
    this.drawPoint(ctx, this.labelX, y, pointSize, '#ffc751');
    this.drawPoint(ctx, this.labelX, y, pointSize * 0.7, '#101015');
  }

  private drawPoint(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string): void {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  private drawGrid(ctx: CanvasRenderingContext2D, stats: IStats, info: ICanvasInfo): void {
    ctx.lineWidth = 1 + info.W / 800;
    ctx.strokeStyle = '#555'
    ctx.beginPath()
    ctx.moveTo(info.grid.left, info.H - info.grid.bottom);
    ctx.lineTo(info.W - info.grid.right, info.H - info.grid.bottom);
    ctx.moveTo(info.grid.left, info.H - info.grid.bottom);
    ctx.lineTo(info.grid.left, info.grid.top);
    ctx.closePath();
    ctx.stroke();
    ctx.lineWidth = 1
    ctx.setLineDash([2, 4]);
    const stepY = (info.H - info.curve.top - info.curve.bottom) / 6
    ctx.beginPath()
    ctx.font = `bold ${11 + info.W / 200}px Arial`;
    ctx.fillStyle = '#555';
    ctx.fillText( 0  + '', info.grid.right / 2, info.H - info.curve.bottom);
    for (let i = 1; i < 6; i++) {
      ctx.fillText( (i / 6 * this.stats.maxValue).toFixed(0)  + '', info.grid.right / 2, info.H - info.curve.bottom - stepY * i);
      ctx.moveTo(info.grid.left, info.H - info.curve.bottom - stepY * i);
      ctx.lineTo(info.W - info.grid.right, info.H - info.curve.bottom - stepY * i);
    }
    ctx.fillText( this.stats.maxValue  + '', info.grid.right / 2, info.curve.top);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
  }

  handleMouseMove(e: MouseEvent): void {
    this.showLabel(e.offsetX * this.ratio, e.offsetY * this.ratio);
  }

  private showLabel(x: number, y: number): void {
    if (x < this.canvasInfo.curve.left || x > this.canvasInfo.W - this.canvasInfo.curve.right) {
      return;
    }
    const i = Math.round((x - this.canvasInfo.curve.left) / this.xStep);
    this.currentValue = this.stats.values[i];
    this.labelVisible = true;
    const previousX = this.labelX;
    this.labelX = this.canvasInfo.curve.left + i * this.xStep;
    if (previousX ===this.labelX) {
      return; // is means current value not changed;
    }
    this.drawChart(this.canvas, this.stats);
    if (this.ctx)
      this.drawCurrentValue(this.ctx, this.canvasInfo);
  }

  getLegendPosition(): string {
    return `top: 50%; left: ${this.labelX / this.ratio}px`;
  }
}
