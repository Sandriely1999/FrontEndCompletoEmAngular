// src/app/service/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OrderResponse} from '../models/responses/order.response';

@Injectable({
  providedIn: 'root'
})

export class PedidoService {
  private apiUrl = 'http://localhost:8080/orders';

  constructor(private http: HttpClient) {}

  listaPedidosPronto(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/listaPedidosPronto`);
  }
}
