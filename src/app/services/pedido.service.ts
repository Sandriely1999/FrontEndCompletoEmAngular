// src/app/service/pedido.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OrderResponse} from '../models/responses/order.response';
import {DishResponse} from '../models/responses/dish.response';
import {NewOrderRequest} from '../models/requests/order.request';

@Injectable({
  providedIn: 'root'
})

export class PedidoService {
  private readonly baseUrl = 'http://localhost:8080';
  private readonly ordersUrl = `${this.baseUrl}/orders`;
  private readonly dishesUrl = `${this.baseUrl}/dishes`;

  constructor(private http: HttpClient) {}

  // Endpoints existentes
  listaPedidosPronto(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.ordersUrl}/listaPedidosPronto`);
  }

  trocarStatusParaEnviando(orderId: number): Observable<void> {
    return this.http.put<void>(`${this.ordersUrl}/trocarStatusParaEnviando/${orderId}`, {});
  }

  // Novos endpoints
  getAllValidDishes(): Observable<DishResponse[]> {
    return this.http.get<DishResponse[]>(`${this.dishesUrl}/getAllValidDishes`);
  }

  criarPedido(orderData: NewOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.ordersUrl}/criarPedido`, orderData);
  }

}
