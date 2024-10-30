import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import {CommonModule} from "@angular/common";
import {OrderResponse} from '../../models/responses/order.response';
import {UserResponse} from '../../models/responses/user.response';

@Component({
  selector: 'app-entregador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entregador.component.html',
  styleUrls: ['./entregador.component.css']
})

export class EntregadorComponent implements OnInit {
  orderResponses: OrderResponse[] = [];
  //userResponse: UserResponse;

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.carregarPedidos();
  }

  carregarPedidos() {
    this.pedidoService.listaPedidosPronto().subscribe({
      next: (response) => {
        this.orderResponses = response;
      },
      error: (erro) => {
        console.error('Erro ao carregar pedidos:', erro);
      }
    });
  }


}
