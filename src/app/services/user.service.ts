
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserResponse} from '../models/responses/user.response';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {
  }


  getUserById(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`/api/user/${userId}`);
  }

}
