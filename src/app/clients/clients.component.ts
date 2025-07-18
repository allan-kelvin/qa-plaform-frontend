import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { ClienteDTO, ClientesService } from '../services/clientes.service';



@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginator,
    MatSlideToggle,
    MatSnackBarModule,
    MatFormFieldModule
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss'
})
export class ClientsComponent {

  displayedColumns: string[] = ['nome', 'cnpj', 'status', 'actions'];
  originalClientes: any[] = [];

  constructor(
    private clientesService: ClientesService,
    private snackBar: MatSnackBar
  ) { }

  dataSource = new MatTableDataSource<ClienteDTO>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.clientesService.getAll().subscribe({
      next: (clientes) => {
        const dataComStatus = clientes.map(cliente => ({
          ...cliente,
          status: cliente.ativo ? 'Ativo' : 'Inativo'
        }));
        this.originalClientes = dataComStatus;
        this.dataSource.data = dataComStatus;
      },
      error: (err) => {
        console.error('Erro ao buscar clientes', err);
        alert('Erro ao buscar clientes!');
      }
    });
  }


  filtrarClientes(termo: string): void {
    const filtro = termo.toLowerCase().trim();
    this.dataSource.data = this.originalClientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(filtro) ||
      cliente.cnpj.toLowerCase().includes(filtro)
    );
  }
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Ativo': return 'status-active';
      case 'Inativo': return 'status-inactive';
      case 'Suspenso': return 'status-suspended';
      default: return '';
    }
  }

  toggleStatus(client: any): void {
    const updatedStatus = !client.ativo;
    const updatePayload = { ativo: updatedStatus };

    this.clientesService.updateClient(client.id, updatePayload).subscribe({
      next: (updatedClient) => {
        client.ativo = updatedClient.ativo;
      },
      error: (err) => {
        console.error('Erro ao atualizar status', err);
      }
    });
  }
  deleteClient(client: ClienteDTO): void {
    if (confirm(`Tem certeza que deseja excluir o cliente ${client.nome}?`)) {
      this.clientesService.delete(client.id!).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(c => c.id !== client.id);
          this.mostrarMensagem('Cliente excluído com sucesso!', 'amarelo');
        },
        error: (err) => {
          console.error('Erro ao excluir cliente', err);
          alert('Erro ao excluir cliente.');
        }
      });
    }
  }

  mostrarMensagem(mensagem: string, tipo: 'verde' | 'amarelo' | 'vermelho' = 'verde'): void {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 3000,
      panelClass: [tipo]
    });
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtrarClientes(input.value);
  }
}
