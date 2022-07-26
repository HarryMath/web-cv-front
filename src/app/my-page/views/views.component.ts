import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DateService} from '../../shared/date.service';
import {IStats, IValue} from './days-chart/days-chart.component';

interface IVisit {
  ip: string,
  visitorLogin: string|undefined|null,
  country: string|undefined|null,
  city: string|undefined|null,
  timestamp: number,
}

interface IVisitor {
  ip: string,
  login: string|undefined|null,
  country: string|undefined|null,
  city: string|undefined|null,
  visits: string[]
}

interface IDayStats {
  date: string,
  day: string,
  daysAgo: number,
  visitors: IVisitor[]
}

interface IPiePiece {
  label: string,
  value: number,
  part: number,
  color: string,
}

@Component({
  selector: 'app-views',
  templateUrl: './views.component.html',
  styleUrls: ['./views.component.sass']
})
export class ViewsComponent implements OnInit {

  isLoading = true;
  visits: IDayStats[] = [];
  stats: IStats = { name: 'visits', maxValue: 0, values: [] };
  countryStats: IPiePiece[] = [];
  readonly appLink = 'https://dev-cv.web.app/';
  dateWidth = '';
  infoWidth = '';

  constructor(
    private http: HttpClient,
    public dateService: DateService,
  ) { }

  ngOnInit(): void {
    this.loadVisits().then(v => {
      this.visits = this.aggregateData(v);
      this.stats = this.prepareVisitsForChart(this.visits);
      this.countryStats = this.prepareCountries(this.visits);
      this.isLoading = false;
      setTimeout(() => {
        this.dateWidth = this.getMaxWidth('.day .date') + 'px';
        this.infoWidth = this.getMaxWidth('.day .info') + 'px'
      }, 200)
    });
  }

  private getMaxWidth(query: string): number {
    let max = 0;
    document.querySelectorAll<HTMLDivElement>(query).forEach(el => {
      if (el.offsetWidth > max) {
        max = el.offsetWidth;
      }
    });
    return max;
  }

  private aggregateData(visits: IVisit[]): IDayStats[] {
    let lastDay = -1;
    const daysStats: IDayStats[] = [];
    visits = visits.sort((v1, v2) => v1.timestamp - v2.timestamp);
    for (let v of visits) {
      const daysAgo = this.dateService.getDaysPassed(v.timestamp);
      if (daysAgo != lastDay) {
        daysStats.unshift({
          daysAgo,
          day: this.dateService.getWeekDayByDaysAgo(daysAgo),
          date: this.dateService.getDateByDaysAgo(daysAgo),
          visitors: []
        });
        lastDay = daysAgo;
      }
      let isNewVisitor = true;
      for (let visitor of daysStats[0].visitors) {
        if (visitor.ip === v.ip) {
          isNewVisitor = false;
          visitor.visits.push(this.dateService.getTime(v.timestamp));
          visitor.login = visitor.login || v.visitorLogin;
          break;
        }
      }
      if (isNewVisitor) {
        daysStats[0].visitors.push({
          ip: v.ip,
          login: v.visitorLogin,
          country: v.country,
          city: v.city,
          visits: [this.dateService.getTime(v.timestamp)]
        });
      }
    }
    return daysStats;
  }

  private prepareVisitsForChart(visits: IDayStats[]): IStats {
    const values: IValue[] = [];
    let max = 0;
    let lastDay = -1;
    for (let v of visits) {
      if (v.daysAgo !== lastDay) {
        for (let i = 1; i < (v.daysAgo - lastDay); i++) {
          values.unshift({
            label: this.dateService.getDateByDaysAgo(lastDay + i),
            value: 0
          });
        }
      }
      lastDay = v.daysAgo;
      values.unshift({
        label: this.dateService.getWeekDayByDaysAgo(lastDay, true) + ', ' +
          this.dateService.getDateByDaysAgo(lastDay, true),
        value: v.visitors.reduce((total, v0) => total + v0.visits.length, 0)
      });
      if (values[0].value > max) {
        max = values[0].value;
      }
    }
    return { name: 'visits', maxValue: max, values };
  }

  private prepareCountries(stats: IDayStats[]): IPiePiece[] {
    const result: IPiePiece[] = [];
    let visitor: IVisitor;
    let totalVisitors = 0;
    stats.forEach(d => d.visitors.forEach(v => {
      visitor = v;
      totalVisitors += 1;
      if (visitor.country == null) {
        visitor.country = 'Undefined region';
      }
      const country = result.find(c => c.label === visitor.country);
      if (country) {
        country.value++;
      } else {
        result.push({
          label: visitor.country,
          value: 2,
          color: this.generateColor(visitor.country),
          part: 0
        });
      }
    }));
    result.forEach(c => c.part = c.value / totalVisitors);
    return result;
  }

  private generateColor(text: string): string {
    let textValue = text.split('').reduce(
      (val, symbol) => val + symbol.charCodeAt(0), 50);
    const h = textValue % 360;
    const s = 65 + textValue % 21;
    const l = 55 + textValue % 19;
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  private loadVisits(): Promise<IVisit[]> {
    this.isLoading = true;
    return new Promise<IVisit[]>((resolve, reject) => {
      this.http.get<IVisit[]>('profiles/me/visits').subscribe({
        next: v => resolve(v),
        error: e => reject(e)
      });
    })
  }

  hasLocation(v: IVisitor): boolean {
    return !!v.country && v.country != 'null' && !v.country.includes('undefined');
  }

  getLocation(v: IVisitor): string {
    return `${v.city ? v.city + ', ' : ''}${v.country}`;
  }

  getVisits(v: IVisitor): string {
    if (v.visits.length > 3) {
      return `visited ${v.visits.length} times since ${v.visits[0]}`
    } else {
      return 'at ' + v.visits.join(', ');
    }
  }
}
