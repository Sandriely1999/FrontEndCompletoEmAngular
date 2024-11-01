

export class NewOrderItemRequest {
  dishId: number;
  quantity: number;


  constructor(dishId: number, quantity: number) {
    this.dishId = dishId;
    this.quantity = quantity;
  }
}
