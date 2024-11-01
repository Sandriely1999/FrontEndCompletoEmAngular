import {NewUserRequest} from './user.request';
import {NewOrderItemRequest} from './orderItem.request';
import {Pagamento} from '../pagamentos.enum';


export class NewOrderRequest {
  orderItems: NewOrderItemRequest[];
  client: NewUserRequest;
  pagamento?: Pagamento;


  constructor(orderItems: NewOrderItemRequest[], client: NewUserRequest, pagamento?: Pagamento) {
    this.orderItems = orderItems;
    this.client = client;
    this.pagamento = pagamento;
  }

}
