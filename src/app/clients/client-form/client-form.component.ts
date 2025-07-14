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
import { Client } from '../clients.component';
@Component({
  selector: 'app-client-form',
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
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss'
})
export class ClientFormComponent implements OnInit {

  clientForm: FormGroup;
  isEditMode = false;
  clientId: number | null = null;

  statusOptions: ('Ativo' | 'Inativo' | 'Suspenso')[] = ['Ativo', 'Inativo', 'Suspenso'];

  // Dados mockados para simular um cliente sendo editado
  mockClients: Client[] = [
    { id: 1, nome: 'Tech Solutions Ltda.', cnpj: '12.345.678/0001-90', contatoPrincipal: 'Ana Costa', emailContato: 'ana.costa@techsolutions.com', telefoneContato: '(11) 98765-4321', status: 'Ativo', dataCadastro: '2023-01-10' },
    { id: 2, nome: 'Inova Digital S.A.', cnpj: '98.765.432/0001-21', contatoPrincipal: 'Bruno Mendes', emailContato: 'bruno.mendes@inovadigital.com', telefoneContato: '(21) 91234-5678', status: 'Ativo', dataCadastro: '2023-03-22' },
    { id: 3, nome: 'Alpha Consultoria', cnpj: '45.678.901/0001-34', contatoPrincipal: 'Carla Silva', emailContato: 'carla.silva@alphaconsultoria.com', telefoneContato: '(31) 99876-5432', status: 'Inativo', dataCadastro: '2023-05-01' },
    { id: 4, nome: 'Beta Indústria', cnpj: '21.098.765/0001-56', contatoPrincipal: 'Daniela Lima', emailContato: 'daniela.lima@betaindustria.com', telefoneContato: '(41) 97654-3210', status: 'Suspenso', dataCadastro: '2023-07-18' },
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]], // Validação de CNPJ
      contatoPrincipal: ['', Validators.required],
      emailContato: ['', [Validators.required, Validators.email]],
      telefoneContato: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}\-\d{4}$/)]], // Validação de telefone (ex: (XX) XXXX-XXXX ou (XX) XXXXX-XXXX)
      status: ['Ativo', Validators.required], // Valor padrão 'Ativo'
      dataCadastro: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.clientId = Number(params.get('id'));
      if (this.clientId) {
        this.isEditMode = true;
        this.loadClientData(this.clientId);
      }
    });
  }

  loadClientData(id: number): void {
    const clientToEdit = this.mockClients.find(c => c.id === id);
    if (clientToEdit) {
      this.clientForm.patchValue({
        nome: clientToEdit.nome,
        cnpj: clientToEdit.cnpj,
        contatoPrincipal: clientToEdit.contatoPrincipal,
        emailContato: clientToEdit.emailContato,
        telefoneContato: clientToEdit.telefoneContato,
        status: clientToEdit.status,
        dataCadastro: new Date(clientToEdit.dataCadastro) // Para o datepicker
      });
    } else {
      console.error(`Cliente com ID ${id} não encontrado nos dados mockados.`);
      this.router.navigate(['/clients']);
    }
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      // Ajusta a data para o formato de string YYYY-MM-DD
      if (clientData.dataCadastro instanceof Date) {
        clientData.dataCadastro = clientData.dataCadastro.toISOString().split('T')[0];
      }

      if (this.isEditMode) {
        console.log('Atualizando cliente:', { ...clientData, id: this.clientId });
        alert('Cliente atualizado com sucesso (simulado)!');
      } else {
        const newId = this.mockClients.length > 0 ? Math.max(...this.mockClients.map(c => c.id)) + 1 : 1;
        console.log('Criando novo cliente:', { ...clientData, id: newId });
        alert('Cliente criado com sucesso (simulado)!');
      }
      this.router.navigate(['/clients']); // Volta para a listagem
    } else {
      console.error('Formulário inválido!');
      alert('Por favor, preencha todos os campos obrigatórios e corrija os erros.');
      this.clientForm.markAllAsTouched(); // Marca todos os campos como "tocados" para exibir erros
    }
  }

  onCancel(): void {
    this.router.navigate(['/clients']); // Volta para a listagem
  }

}
