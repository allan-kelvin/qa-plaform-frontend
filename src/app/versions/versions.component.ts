import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

export interface Version {
  id: number;
  area: string;
  cliente: string;
  tipo: string;
  nome: string;
  tarefa: string;
  descricao: string;
  qa: string;
  merge: string;
  script: string;
  dataLancamento: string;
  status: 'Em Teste' | 'Homologada' | 'Publicada' | 'Arquivada';
}

@Component({
  selector: 'app-versions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './versions.component.html',
  styleUrl: './versions.component.scss'
})
export class VersionsComponent {

  displayedColumns: string[] = [
    'area', 'cliente', 'tipo', 'nome', 'tarefa', 'descricao',
    'qa', 'merge', 'script', 'dataLancamento', 'status', 'actions'
  ];

  dataSource: Version[] = [
    { id: 1, area: 'Financeiro', cliente: 'Cliente A', tipo: 'Correção', nome: '1.3.0', tarefa: '123', descricao: 'Correção de bug no cálculo de juros.', qa: 'QA Pleno', merge: 'Mergeado', script: 'Rodado', dataLancamento: '2024-01-15', status: 'Homologada' },
    { id: 2, area: 'Marketing', cliente: 'Cliente B', tipo: 'Melhoria', nome: '1.2.5', tarefa: '118', descricao: 'Melhoria na interface de campanhas.', qa: 'Tech Lead', merge: 'Não mergea', script: 'Sem script', dataLancamento: '2024-02-20', status: 'Publicada' },
    { id: 3, area: 'RH', cliente: 'Cliente A', tipo: 'Alteração', nome: '1.1.5', tarefa: '118', descricao: 'Alteração no layout do portal do colaborador.', qa: 'QA Senior', merge: 'Aguardando', script: 'Conflito', dataLancamento: '2024-03-10', status: 'Em Teste' },
    { id: 4, area: 'Vendas', cliente: 'Cliente B', tipo: 'Desejável', nome: '1.0.4', tarefa: '124', descricao: 'Correção de alteração no carrinho de compras.', qa: 'QA Senior', merge: 'Desejável', script: 'Conflito', dataLancamento: '2024-04-05', status: 'Arquivada' },
    { id: 5, area: 'Financeiro', cliente: 'Cliente A', tipo: 'Confirmado', nome: '1.1.5', tarefa: '224', descricao: 'Correção de bug no fechamento de caixa.', qa: 'QA Pleno', merge: 'Confirmado', script: 'Rodado', dataLancamento: '2024-05-01', status: 'Em Teste' },
    { id: 6, area: 'Marketing', cliente: 'Cliente B', tipo: 'Desejável', nome: '1.0.1', tarefa: '321', descricao: 'Melhoria no layout dos e-mails transacionais.', qa: 'QA Senior', merge: 'Não mergea', script: 'Sem script', dataLancamento: '2024-06-01', status: 'Homologada' },
    { id: 7, area: 'RH', cliente: 'Cliente A', tipo: 'Desejável', nome: '0.1.1', tarefa: '416', descricao: 'Ajuste de permissões de acesso a relatórios.', qa: 'QA Senior', merge: 'Aguardando', script: 'Conflito', dataLancamento: '2024-07-01', status: 'Em Teste' },
  ];

  areaFilter = new FormControl('');
  clienteFilter = new FormControl('');
  tipoFilter = new FormControl('');
  searchControl = new FormControl('');

  deleteVersion(version: Version): void {
    if (confirm(`Tem certeza que deseja excluir a versão ${version.nome} do projeto ${version.cliente}?`)) {
      console.log('Excluindo versão (simulado):', version);
      this.dataSource = this.dataSource.filter(v => v.id !== version.id);
      alert('Versão excluída com sucesso (simulado)!');
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Em Teste': return 'status-in-test';
      case 'Homologada': return 'status-approved';
      case 'Publicada': return 'status-published';
      case 'Arquivada': return 'status-archived';
      default: return '';
    }
  }
  getMergeClass(mergeStatus: string): string {
    switch (mergeStatus) {
      case 'Mergeado': return 'status-merged';
      case 'Não mergea': return 'status-not-merged';
      case 'Aguardando': return 'status-pending-merge';
      case 'Desejável': return 'status-desirable-merge';
      default: return '';
    }
  }
}
