import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DateService} from '../../shared/date.service';

interface IVisitor {
  ip: string;
  visitorLogin: string|undefined|null;
  country: string|undefined|null;
  city: string|undefined|null;
  timestamp: number;
}

interface IVisitStats {
  daysPassed: number;
  date: string;
  visits: number;
}

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.sass']
})
export class ViewsComponent implements OnInit {

  isLoading = true;
  visits: IVisitor[] = [];
  @ViewChild('canvas', {static: true}) canvas!: ElementRef<HTMLCanvasElement>;
  private readonly maxDays = 33;

  constructor(
    private http: HttpClient,
    private dateService: DateService
  ) { }

  ngOnInit(): void {
    this.loadVisits();
  }

  afterLoad(v: IVisitor[]): void {
    this.drawChart(v.reverse());
  }

  private drawChart(visits: IVisitor[]): void {
    console.log('vis: ', visits);
    const c = this.canvas.nativeElement.getContext('2d');
    if (!c) return;
    const W = this.canvas.nativeElement.width;
    const H = this.canvas.nativeElement.height;
    const padding = W / 50 + H / 100;
    const visitsStats: IVisitStats[] = [];
    let lastDay = -1;
    let lastDate = '';
    let maxVisits = 0;
    for (let v of visits) {
      const daysPassed = this.dateService.getDaysPassed(v.timestamp);
      if (daysPassed !== lastDay) {
        for (let i = 1; i < (daysPassed - lastDay); i++) {
          if (lastDay + i > this.maxDays)
            break;
          visitsStats.unshift({
            daysPassed: lastDay + i,
            date: this.dateService.getDateByDaysAgo(lastDay + i),
            visits: 0
          });
        }
        if (daysPassed > this.maxDays)
          break;
        lastDay = daysPassed;
        lastDate = this.dateService.getDateByDaysAgo(daysPassed);
        visitsStats.unshift({
          daysPassed,
          date: lastDate,
          visits: 1
        });
      } else {
        visitsStats[0].visits++;
        if (maxVisits < visitsStats[0].visits) {
          maxVisits = visitsStats[0].visits;
        }
      }
    }
    const xStep = (W - padding * 2) / visitsStats.length;
    const yStep = (H - padding * 3) / maxVisits;
    c.beginPath();
    c.strokeStyle = "rgba(131, 199, 127, 0.97)";
    c.lineWidth = 1 + Math.round(W / 250 + H / 350);
    c.moveTo(padding, padding * 1.5);
    for (let i = 1; i < visitsStats.length; i++) {
      c.lineTo(padding + i * xStep, H - padding * 1.5 - visitsStats[i].visits * yStep);
    }
    c.stroke();
    c.closePath();
    c.fillStyle = "rgba(131, 199, 127, 1)";
    const pointSize = 2 + W / 150 + H / 250;
    let v;
    for (let i = 0; i < visitsStats.length; i++) {
      v = visitsStats[i];
      // TODO test without beginPath() for each point
      c.beginPath();
      c.arc(padding + i * xStep, H - padding * 1.5 - v.visits * yStep, pointSize,0, Math.PI * 2);
      c.fill();
      c.closePath();
    }
    // visitsStats.forEach(v => {
    //   // TODO test without beginPath() for each point
    //   c.beginPath();
    //   c.arc(W - padding - v.daysPassed * xStep, v.visits * yStep, pointSize,0, Math.PI * 2);
    //   c.fill();
    //   c.closePath();
    // });

  }

  loadVisits(): void {
    this.http.get<IVisitor[]>('profiles/me/visits').subscribe({
      next: v => {
        this.afterLoad(v);
        this.isLoading = false;
      },
      error: e => {
        this.isLoading = false;
        console.warn(e);
      }
    });
  }

}
