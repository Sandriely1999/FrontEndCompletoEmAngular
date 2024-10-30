import {OrderStatus} from '../orderstatus.enum';
import {Pagamento} from '../pagamentos.enum';
import {UserResponse} from './user.response';

export class OrderResponse {

  orderId : number;
  dataHora: Date;
  orderStatus: OrderStatus;
  userResponse: UserResponse;
  orderItemsId: number[];
  totalPrice : number;
  pagamento: Pagamento;


  constructor(orderId: number, dataHora: Date, orderStatus: OrderStatus, userResponse: UserResponse, orderItemsId: number[], totalPrice: number, pagamento: Pagamento) {
    this.orderId = orderId;
    this.dataHora = dataHora;
    this.orderStatus = orderStatus;
    this.userResponse = userResponse;
    this.orderItemsId = orderItemsId;
    this.totalPrice = totalPrice;
    this.pagamento = pagamento;
  }
}
