import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  createCharacter(charName: string, charPassword: string, charClass: string): Observable<any> {
    const params = new HttpParams()
      .set('charName', charName)
      .set('charPassword', charPassword)
      .set('charClass', charClass);

    return this.http.post(`${this.apiUrl}/createCharacter`, null, { params });
  }

  getCharacterByName(charName: string): Observable<any> {
    const params = new HttpParams().set('charName', charName);
    return this.http.get(`${this.apiUrl}/getCharacterByName`, { params });
  }
}
