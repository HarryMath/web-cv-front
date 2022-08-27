import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

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

interface IPiePiece {
  label: string,
  value: number,
  part: number,
  color: string,
}

@Component({
  selector: 'pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.sass']
})
export class PieChartComponent implements OnInit {

  @ViewChild('canvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D|null = null;
  @Input('data') data!: IPiePiece[];
  labelVisible = false;
  private readonly ratio = window.devicePixelRatio || 1;

  constructor() { }

  ngOnInit(): void {
    this.drawChart(this.canvas, this.data);
  }

  @HostListener('window:resize')
  public redraw(): void {
    this.drawChart(this.canvas, this.data);
    this.labelVisible = false;
  }

  public drawChart(canvas: ElementRef<HTMLCanvasElement>, data: IPiePiece[]): void {
    const rect = canvas.nativeElement.getBoundingClientRect();
    const W = canvas.nativeElement.width = rect.width * this.ratio;
    const H = canvas.nativeElement.height = rect.height * this.ratio;
    const ctx = this.ctx = canvas.nativeElement.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0 , 0, W, H);
    data = data.sort((c1, c2) => c2.part - c1.part);
    let totalAngle = 0;
    data.forEach(c => {
      const part = c.part * Math.PI * 2;
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.moveTo(W/2, H/2);
      ctx.arc(W/2, H/2, Math.min(W, H) * 0.45 - 10, totalAngle, totalAngle + part);
      ctx.lineTo(W/2, H/2);
      totalAngle += part;
      ctx.closePath();
      ctx.fill();
    });
  }

}
