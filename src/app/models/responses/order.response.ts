import {OrderStatus} from '../orderstatus.enum';
import {Pagamento} from '../pagamentos.enum';
import {UserResponse} from './user.response';
import {OrderItemsResponse} from './orderItems.response';

export class OrderResponse {

  orderId : number;
  dataHora: Date;
  orderStatus: OrderStatus;
  userResponse: UserResponse;
  orderItemsResponse: OrderItemsResponse[];
  totalPrice : number;
  pagamento: Pagamento;


  constructor(orderId: number, dataHora: Date, orderStatus: OrderStatus, userResponse: UserResponse, orderItemsResponse: OrderItemsResponse[], totalPrice: number, pagamento: Pagamento) {
    this.orderId = orderId;
    this.dataHora = dataHora;
    this.orderStatus = orderStatus;
    this.userResponse = userResponse;
    this.orderItemsResponse = orderItemsResponse;
    this.totalPrice = totalPrice;
    this.pagamento = pagamento;
  }
}
