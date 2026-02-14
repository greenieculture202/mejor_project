import { Injectable } from '@angular/core';
import { ApiBase } from './api.base';
import { Observable } from 'rxjs';

export interface Plant {
  _id?: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class PlantsApiService {
  constructor(private api: ApiBase) {}

  list(): Observable<Plant[]> {
    return this.api.get<Plant[]>('plants');
  }
}
