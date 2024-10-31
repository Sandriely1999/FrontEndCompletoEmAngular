import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NewDishRequest} from '../models/requests/dish.request';
import {OrderResponse} from "../models/responses/order.response";
import {DishResponse} from "../models/responses/dish.response";

@Injectable({
  providedIn: 'root'
})
export class CozinhaService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getPreparingOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/orders/listaPedidosPreparando`);
  }

  changeOrderStatusToReady(orderId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/orders/trocarStatusParaPronto/${orderId}`,
      {}
    );
  }

  createDish(dish: NewDishRequest): Observable<DishResponse> {
    return this.http.post<DishResponse>(`${this.baseUrl}/dishes`, dish);
  }

  editDish(id: number, dish: NewDishRequest): Observable<DishResponse> {
    return this.http.put<DishResponse>(`${this.baseUrl}/dishes/${id}`, dish);
  }

  updateDishAvailability(id: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/dishes/updateAvailabilityOfDish/${id}`,
      {}
    );
  }

  getAllValidDishes(): Observable<DishResponse[]> {
    return this.http.get<DishResponse[]>(`${this.baseUrl}/dishes/getAllValidDishes`);
  }
}
