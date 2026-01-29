import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatchScore } from '../models/match-score';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private apiUrl = `${environment.apiUrl}/matching`;

  constructor(private http: HttpClient) {}

  getRecommendations(donorId: string): Observable<MatchScore[]> {
    return this.http.get<MatchScore[]>(`${this.apiUrl}/recommendations/${donorId}`);
  }
}
