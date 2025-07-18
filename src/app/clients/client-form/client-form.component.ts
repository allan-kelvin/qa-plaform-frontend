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
import { ClientesService } from '../../services/clientes.service';
import { NotificationService } from '../../shared/services/notification.service';


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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clientesService: ClientesService,
    private notification: NotificationService
  ) {
    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]],
      ativo: [true, Validators.required] // booleano (checkbox ou select)
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
    this.clientesService.getById(id).subscribe({
      next: (cliente) => {
        this.clientForm.patchValue(cliente);
      },
      error: () => {
        alert('Cliente não encontrado.');
        this.router.navigate(['/clients']);
      }
    });
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const data = this.clientForm.value;

      if (this.isEditMode && this.clientId) {
        this.clientesService.update(this.clientId, data).subscribe({
          next: () => {
            this.notification.success('Cliente atualizado com sucesso!');
            this.router.navigate(['/clients']);
          },
          error: (error) => {
            const backendMessage = error?.error?.message;
            const message = Array.isArray(backendMessage)
              ? backendMessage.join(', ')
              : backendMessage || 'Erro ao criar cliente.';

            this.notification.error(message);
            console.error('ERRRO:' + error);
          }
        });
      } else {
        this.clientesService.create(data).subscribe({
          next: () => {
            this.notification.success('Cliente criado com sucesso!');
            this.router.navigate(['/clients']);
          },
          error: (error) => {
            const backendMessage = error?.error?.message;
            const message = Array.isArray(backendMessage)
              ? backendMessage.join(', ')
              : backendMessage || 'Erro ao criar cliente.';

            this.notification.error(message);
            console.error('Erro ao criar cliente:', error);
          }
        });
      }
    } else {
      this.notification.warning('Preencha todos os campos obrigatórios.');
      this.clientForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.router.navigate(['/clients']);
  }
}
