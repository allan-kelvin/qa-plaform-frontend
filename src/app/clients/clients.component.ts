import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

export interface Client {
  id: number;
  nome: string;
  cnpj: string;
  contatoPrincipal: string;
  emailContato: string;
  telefoneContato: string;
  status: 'Ativo' | 'Inativo' | 'Suspenso';
  dataCadastro: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {

  displayedColumns: string[] = ['nome', 'cnpj', 'contatoPrincipal', 'emailContato', 'telefoneContato', 'status', 'actions'];

  // Dados de exemplo (mockados) para a tabela de clientes
  dataSource: Client[] = [
    { id: 1, nome: 'Tech Solutions Ltda.', cnpj: '12.345.678/0001-90', contatoPrincipal: 'Ana Costa', emailContato: 'ana.costa@techsolutions.com', telefoneContato: '(11) 98765-4321', status: 'Ativo', dataCadastro: '2023-01-10' },
    { id: 2, nome: 'Inova Digital S.A.', cnpj: '98.765.432/0001-21', contatoPrincipal: 'Bruno Mendes', emailContato: 'bruno.mendes@inovadigital.com', telefoneContato: '(21) 91234-5678', status: 'Ativo', dataCadastro: '2023-03-22' },
    { id: 3, nome: 'Alpha Consultoria', cnpj: '45.678.901/0001-34', contatoPrincipal: 'Carla Silva', emailContato: 'carla.silva@alphaconsultoria.com', telefoneContato: '(31) 99876-5432', status: 'Inativo', dataCadastro: '2023-05-01' },
    { id: 4, nome: 'Beta Indústria', cnpj: '21.098.765/0001-56', contatoPrincipal: 'Daniela Lima', emailContato: 'daniela.lima@betaindustria.com', telefoneContato: '(41) 97654-3210', status: 'Suspenso', dataCadastro: '2023-07-18' },
  ];

  // Método para obter a classe CSS baseada no status do cliente
  getStatusClass(status: string): string {
    switch (status) {
      case 'Ativo': return 'status-active';
      case 'Inativo': return 'status-inactive';
      case 'Suspenso': return 'status-suspended';
      default: return '';
    }
  }

  // Métodos para ações (por enquanto, apenas placeholders)
  deleteClient(client: Client): void {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.nome}?`)) {
      console.log('Excluindo cliente (simulado):', client);
      // Lógica para chamar a API de exclusão
      this.dataSource = this.dataSource.filter(c => c.id !== client.id);
      alert('Cliente excluído com sucesso (simulado)!');
    }
  }

}
