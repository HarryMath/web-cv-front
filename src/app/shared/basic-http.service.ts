import {HttpClient} from '@angular/common/http';

export abstract class BasicHttpService<Type> {

  constructor(protected readonly path: string, protected http: HttpClient) {}

  update(e: Partial<Type>): Promise<Type> {
    return new Promise<Type>((resolve, reject) => {
      this.http.patch<Type>(this.path, e).subscribe({
        next: p => resolve(p),
        error: e => reject(e)
      });
    });
  }

  save(e: Type): Promise<Type> {
    return new Promise<Type>(((resolve, reject) => {
      this.http.post<Type>(this.path, e).subscribe({
        next: p => resolve(p),
        error: e => reject(e)
      });
    }));
  }

  delete(id: number): Promise<void> {
    return new Promise<void>(((resolve, reject) => {
      this.http.delete(`${this.path}?id=${id}`).subscribe({
        next: () => resolve(),
        error: e => reject(e)
      });
    }));
  }
}
