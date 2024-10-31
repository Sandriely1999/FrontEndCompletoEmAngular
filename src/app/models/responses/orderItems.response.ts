import {DishResponse} from "./dish.response";
import {OrderResponse} from "./order.response";

export class OrderItemsResponse {
  idOrdemItem: number;
  quantity: number;
  dishResponse: DishResponse;
  orderResponse: OrderResponse;


  constructor(idOrdemItem: number, quantity: number, dishResponse: DishResponse, orderResponse: OrderResponse) {
    this.idOrdemItem = idOrdemItem;
    this.quantity = quantity;
    this.dishResponse = dishResponse;
    this.orderResponse = orderResponse;
  }
}
