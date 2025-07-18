import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Version } from '../versions.component';

@Component({
  selector: 'app-version-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './version-form.component.html',
  styleUrl: './version-form.component.scss'
})
export class VersionFormComponent implements OnInit {

  versionForm: FormGroup;
  isEditMode = false;
  versionId: number | null = null;

  areas: string[] = ['Financeiro', 'Marketing', 'RH', 'Vendas', 'Suporte'];
  clientes: string[] = ['Cliente A', 'Cliente B', 'Cliente C'];
  tipos: string[] = ['Correção', 'Melhoria', 'Alteração', 'Desejável', 'Confirmado'];
  qas: string[] = ['QA Jr', 'QA Pleno', 'QA Senior', 'Tech Lead'];
  merges: string[] = ['Mergeado', 'Não mergea', 'Aguardando', 'Desejável'];
  scripts: string[] = ['Rodado', 'Sem script', 'Conflito'];
  statusOptions: ('Em Teste' | 'Homologada' | 'Publicada' | 'Arquivada')[] = ['Em Teste', 'Homologada', 'Publicada', 'Arquivada'];



  mockVersions: Version[] = [
    { id: 1, area: 'Financeiro', cliente: 'Cliente A', tipo: 'Correção', nome: '1.3.0', tarefa: '123', descricao: 'Correção de bug no cálculo de juros.', qa: 'QA Pleno', merge: 'Mergeado', script: 'Rodado', dataLancamento: '2024-01-15', status: 'Homologada' },
    { id: 2, area: 'Marketing', cliente: 'Cliente B', tipo: 'Melhoria', nome: '1.2.5', tarefa: '118', descricao: 'Melhoria na interface de campanhas.', qa: 'Tech Lead', merge: 'Não mergea', script: 'Sem script', dataLancamento: '2024-02-20', status: 'Publicada' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.versionForm = this.fb.group({
      area: ['', Validators.required],
      cliente: ['', Validators.required],
      tipo: ['', Validators.required],
      nome: ['', Validators.required], // Para o número da versão (ex: 1.0.0)
      tarefa: ['', Validators.required],
      descricao: ['', Validators.required],
      qa: ['', Validators.required],
      merge: ['', Validators.required],
      script: ['', Validators.required],
      dataLancamento: ['', Validators.required], // Campo de data
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.versionId = Number(params.get('id')); // Tenta obter o ID da URL
      if (this.versionId) {
        this.isEditMode = true;
        this.loadVersionData(this.versionId); // Carrega os dados se for edição
      }
    });
  }

  loadVersionData(id: number): void {
    // Em um cenário real, você faria uma chamada API aqui
    const versionToEdit = this.mockVersions.find(v => v.id === id);
    if (versionToEdit) {
      this.versionForm.patchValue({
        area: versionToEdit.area,
        cliente: versionToEdit.cliente,
        tipo: versionToEdit.tipo,
        nome: versionToEdit.nome,
        tarefa: versionToEdit.tarefa,
        descricao: versionToEdit.descricao,
        qa: versionToEdit.qa,
        merge: versionToEdit.merge,
        script: versionToEdit.script,
        // Importante: para o datepicker, o valor deve ser um objeto Date
        dataLancamento: new Date(versionToEdit.dataLancamento),
        status: versionToEdit.status
      });
    } else {
      console.error(`Versão com ID ${id} não encontrada nos dados mockados.`);
      this.router.navigate(['/versions']);
    }
  }

  onSubmit(): void {
    if (this.versionForm.valid) {
      const versionData = this.versionForm.value;
      // Ajusta a data para o formato de string YYYY-MM-DD antes de 'salvar'
      if (versionData.dataLancamento instanceof Date) {
        versionData.dataLancamento = versionData.dataLancamento.toISOString().split('T')[0];
      }

      if (this.isEditMode) {

        alert('Versão atualizada com sucesso (simulado)!');
      } else {
        // Em um cenário real, o ID viria do backend após a criação
        const newId = this.mockVersions.length > 0 ? Math.max(...this.mockVersions.map(v => v.id)) + 1 : 1;

        alert('Versão criada com sucesso (simulado)!');
      }
      this.router.navigate(['/versions']); // Volta para a listagem
    } else {
      console.error('Formulário inválido!');
      alert('Por favor, preencha todos os campos obrigatórios e corrija os erros.');
      this.versionForm.markAllAsTouched(); // Marca todos os campos como "tocados"
    }
  }

  onCancel(): void {
    this.router.navigate(['/versions']); // Volta para a listagem
  }

}
