import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Subscription} from "rxjs";

const POINTS_PER_BUBBLE = 15;
const MIN_RADIUS = 20;
const MAX_RADIUS = 100
const F = 0.05;

@Component({
  selector: 'app-bubbles',
  templateUrl: './bubbles.component.html',
  styleUrls: ['./bubbles.component.sass']
})
export class BubblesComponent implements OnInit, OnDestroy {

  @Input() blub!: EventEmitter<any>;
  subscription: Subscription | undefined;

  @ViewChild('canvas', {static: true}) ref!: ElementRef<HTMLCanvasElement>;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  private isDestroyed = false;
  private bubbles: Bubble[] = [];
  private color = '#222231';
  private amount: number = 41;
  private W: number = 1800;
  private H: number = 720;
  private D: number = 1200;

  constructor() { }

  ngOnInit(): void {
    this.canvas = this.ref.nativeElement; // @ts-ignore
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    console.log('creating bubbles with sized: ' + this.canvas.offsetWidth + ' ' + this.canvas.offsetHeight)
    this.generateBubbles();
    this.process();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private generateBubbles(): void {
    this.bubbles = [];
    for (let  i = 0; i < this.amount; i++) {
      this.bubbles.push(new Bubble(
        rand(rand(MAX_RADIUS + 5, this.W - MAX_RADIUS - 5), rand(MAX_RADIUS + 5, this.W - MAX_RADIUS - 5)),
        rand(rand(MAX_RADIUS + 5, this.H - MAX_RADIUS - 5), rand(MAX_RADIUS + 5, this.H - MAX_RADIUS - 5)),
        this.D
      ));
    }
    this.bubbles.forEach(b => b.resize(this.W, this.H, this.D));
    this.subscription = this.blub.subscribe(next => {
      this.centerBlub();
    });
  }

  private centerBlub(): void {
    let dx, dy, d;
    this.bubbles.forEach(b => {
      b.shell.forEach(p => {
        dx = p.x - this.W * 0.5;
        dy = p.y - this.H * 0.5;
        d = Math.hypot(dx, dy);
        p.speedX += 4 * dx / (1 + d) + Math.random() * 2 - 1;
        p.speedY += 4 * dy / (1 + d) + Math.random() * 2 - 1;
      });
      b.radius *= 1 + Math.random() * 0.6 - 0.3
    });
  }

  public process(): void {
    if (!this || this.isDestroyed) return;
    let i = 0;
    this.bubbles.forEach(b => {
      b.move(i++ % 3 != 0);
      b.move(i % 3 != 0);
      b.checkWalls(this.W, this.H, -3);
    });
    this.render();
    requestAnimationFrame(this.process.bind(this));
  }

  private render(): void {
    this.ctx.fillStyle = '#191923';
    // this.ctx.fillRect(0, 0, this.W, this.H);
    this.ctx.clearRect(0, 0, this.W, this.H);
    this.ctx.fillStyle = this.color;
    let xc, yc;
    this.bubbles.forEach(b => {
      this.ctx.beginPath();
      const startPoint = b.shell[b.shell.length - 1];
      this.ctx.moveTo(startPoint.x, startPoint.y);
      for (let i = 0; i < b.shell.length - 1; i++) {
        xc = (b.shell[i].x + b.shell[i + 1].x) * 0.5;
        yc = (b.shell[i].y + b.shell[i + 1].y) * 0.5;
        this.ctx.quadraticCurveTo(b.shell[i].x, b.shell[i].y, xc, yc);
      }
      xc = (b.shell[b.shell.length - 1].x + b.shell[0].x) * 0.5;
      yc = (b.shell[b.shell.length - 1].y + b.shell[0].y) * 0.5;
      this.ctx.quadraticCurveTo(
        b.shell[b.shell.length - 1].x,
        b.shell[b.shell.length - 1].y,
        xc, yc
      );
      this.ctx.fill();
      this.ctx.closePath();
    });
  }

  @HostListener('window:resize')
  public resize(): void {
    this.W = this.canvas.offsetWidth;
    this.H = this.canvas.offsetHeight;
    this.canvas.width = this.W;
    this.canvas.height = this.H;
    this.D = Math.hypot(this.W, this.H);
    this.bubbles.forEach(b => b.resize(this.W, this.H, this.D));
  }

}

const rand = (start: number, end: number): number => {
  return Math.random() * (end - start) + start;
}

class Bubble {

  center: Point;
  amount: number;
  radius: number;
  initialRadius: number;
  shell: Point[];
  w: number = 0;
  h: number = 0;

  constructor(x: number, y: number, diagonal: number)	{
    this.center = new Point(x, y, 0, 0);
    this.initialRadius = rand(MIN_RADIUS, rand(MIN_RADIUS * 0.7 + MAX_RADIUS * 0.3, MAX_RADIUS));
    this.radius = this.initialRadius * Math.sqrt(diagonal / 1200);
    this.amount = Math.round(Math.sqrt(this.initialRadius) * 0.1 + POINTS_PER_BUBBLE);
    this.shell = [];
    for (let i = 0; i < this.amount; i++) {
      this.shell.push(new Point(
        this.radius * 0.99 * Math.cos(Math.PI/this.amount * 2*i) + this.center.x,
        this.radius * 0.99 * Math.sin(Math.PI/this.amount * 2*i) + this.center.y,
        0, 0
      ));
    }
  }

  transX(i: number): number {
    return this.radius * Math.cos(2 * Math.PI/this.amount * i) + this.center.x - this.shell[i].x
  }

  transY(i: number): number {
    return this.radius * Math.sin(2 * Math.PI/this.amount * i) + this.center.y - this.shell[i].y
  }

  defineCenter(): void {
    this.center.x = 0;
    this.center.y = 0;
    for(let i = 0; i < this.shell.length; i++) {
      this.center.x += this.shell[i].x
      this.center.y += this.shell[i].y
    }
    this.center.x /= this.shell.length
    this.center.y /= this.shell.length
  }

  move(moveToSenter: boolean) {
    this.defineCenter();
    const randX = rand(-0.03, 0.03);
    const randY = rand(-0.03, 0.03);
    for (let i = 0; i < this.amount; i++) {
      const translateXold = this.transX(i);
      const translateYold = this.transY(i);
      let coefOld = 0.2;
      let coefNew = 0.8;
      let translateX = this.center.x - this.shell[i].x;
      let translateY = this.center.y - this.shell[i].y;
      const distanceFromCenter = Math.hypot(translateX, translateY);
      const transformCoef = Math.log(distanceFromCenter / this.radius + 0.1);
      translateX *= transformCoef;
      translateY *= transformCoef;
      if(distanceFromCenter < this.radius * 2) {
        let changeCoef = this.radius / distanceFromCenter / 5;
        coefOld += changeCoef;
        coefNew -= changeCoef;
        if(coefNew < 0) coefNew = 0;
        if(coefOld > 1) coefOld = 1;
        if(distanceFromCenter < this.radius * 0.6) {
          this.shell[i].x += translateXold * 0.1 * (this.radius / (distanceFromCenter + 0.01));
          this.shell[i].y += translateYold * 0.1 * (this.radius / (distanceFromCenter + 0.01));
        }
      }
      this.shell[i].speedX += F * (translateX * coefNew + translateXold * coefOld) + randX;
      this.shell[i].speedY += F * (translateY * coefNew + translateYold * coefOld) + randY;
      // move to center
      if (moveToSenter && Math.random() < 0.3) {
        const dX = this.w * 0.5 - this.shell[i].x;
        const dY = this.h * 0.5 - this.shell[i].y;
        const d = Math.hypot(dX, dY);
        const maxD = 1 + (this.w * 0.6 + this.h * 0.4) * 0.2;
        let c = d > maxD + 5 ? (d / (maxD + 5) - 1) :
          d < maxD - 5 ? (d / (maxD - 5) - 1) : 0;
        c = c > 1 ? 1 : c < -1 ? -1 : c;
        c = c * c * c * 0.00005;
        this.shell[i].ax += dX * c;
        this.shell[i].ay += dY * c;
      }
      if (i % 3 == 0 && Math.random() < 0.4) {
        const power = rand(-0.13, 0.13);
        this.shell[i].speedX += power * Math.cos(2 * Math.PI/this.amount * i);
        this.shell[i].speedY += power * Math.sin(2 * Math.PI/this.amount * i);
      }
      if (this.shell[i].speedVectorSquareLen() >= this.radius*this.radius * 0.7) {
        this.shell[i].mullSpeed(0.98);
        this.shell[i].x += translateXold * 0.17;
        this.shell[i].y += translateYold * 0.17;
      }
      this.shell[i].move(0.66);
      this.shell[i].x += translateXold * 0.0089;
      this.shell[i].y += translateYold * 0.0089;
    }
  }

  checkWalls(w: number, h: number, border: number)	{
    for (let p of this.shell) {
      const intersectRight = p.x >= w - border;
      const intersectLeft = p.x <= border;
      if (intersectRight || intersectLeft)	{
        p.x = intersectRight ? p.x = w - border - 1 : p.x = border + 1;
        p.speedX = Math.abs(p.speedX);
        p.speedX = intersectRight ? -p.speedX : p.speedX;
        p.mullSpeed(0.92);
      }
      const intersectTop = p.y >= h - border;
      const intersectBottom = p.y <= border;
      if (intersectTop || intersectBottom) {
        p.y = intersectTop ?  h - border - 1 : p.y = border + 1;
        p.speedY = Math.abs(p.speedY);
        p.speedY = intersectTop ? -p.speedY : p.speedY;
        p.mullSpeed(0.92);
      }
    }
  }

  resize(w: number, h: number, diagonal: number) {
    this.w = w;
    this.h = h;
    this.radius = this.initialRadius * Math.sqrt(diagonal / 1200);
  }
}

class Point {
  x: number;
  y: number;
  speedX: number = 0;
  speedY: number = 0;
  ax: number = 0;
  ay: number = 0;

  constructor(x: number, y: number, speedX: number, speedY: number) {
    this.x = x;
    this.y = y;
    this.speedX = speedX
    this.speedY = speedY
  }

  mullSpeed(c: number) {
    this.speedX *= c;
    this.speedY *= c;
  }

  move(c: number) {
    this.x += this.speedX * c;
    this.y += this.speedY * c;
    this.speedX += this.ax * c;
    this.speedY += this.ay * c;
    this.mullSpeed(0.998);
    this.ay *= 0.88;
    this.ax *= 0.88;
  }

  speedVectorSquareLen(): number {
    return this.speedX * this.speedX + this.speedY * this.speedY;
  }
}
