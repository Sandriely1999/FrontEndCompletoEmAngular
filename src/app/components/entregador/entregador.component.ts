import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../../services/pedido.service';
import {CommonModule} from "@angular/common";
import {OrderResponse} from '../../models/responses/order.response';


@Component({
  selector: 'app-entregador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './entregador.component.html',
  styleUrls: ['./entregador.component.css']
})

export class EntregadorComponent implements OnInit {
  orderResponses: OrderResponse[] = [];


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

  // Novo método para iniciar o trajeto
  iniciarTrajeto(orderId: number) {
    this.pedidoService.trocarStatusParaEnviando(orderId).subscribe({
      next: () => {
        console.log(`Status do pedido #${orderId} atualizado para Enviando`);
        this.carregarPedidos(); // Recarrega os pedidos para obter a atualização
      },
      error: (erro) => {
        console.error(`Erro ao iniciar o trajeto do pedido #${orderId}:`, erro);
      }
    });
  }
}
