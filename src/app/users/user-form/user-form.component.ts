import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CargoUsuario, CreateUserDto, NomePermissao, Permissao, UpdateUserDto, User } from '../../core/models/user.model';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode: boolean = false;
  cargos = Object.values(CargoUsuario); // Array dos valores do enum CargoUsuario
  permissoesDisponiveis = Object.values(NomePermissao); // Array dos valores do enum NomePermissao
  allPermissoes: Permissao[] = []; // Lista de permissões do backend, se tiver uma rota para isso

  constructor(
    public dialogRef: MatDialogRef<UserFormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: User // Opcional: injeta dados de usuário se for edição
  ) { }

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
    this.setFormData();

  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [null], // Apenas para identificar se é edição, não será enviado na criação/edição
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Senha é obrigatória na criação, mas opcional na edição (não a exiba/modifique sem querer)
      senha: ['', this.isEditMode ? null : Validators.required],
      cargo: [CargoUsuario.QA_JUNIOR, Validators.required], // Valor padrão
      ativo: [true], // Valor padrão
      permissoesIds: [[]] // Array para armazenar IDs de permissões selecionadas
    });

    // Se estiver em modo de edição, desabilite o campo de senha
    if (this.isEditMode) {
      this.userForm.get('senha')?.disable(); // Desabilita o campo de senha na edição
    }
  }

  setFormData(): void {
    if (this.isEditMode && this.data) {
      // Preenche o formulário com os dados do usuário existente
      this.userForm.patchValue({
        id: this.data.id,
        nome: this.data.nome,
        email: this.data.email,
        cargo: this.data.cargo,
        ativo: this.data.ativo,
        // Converte as permissões do usuário em um array de IDs para o formulário
        permissoesIds: this.data.permissoes?.map(p => p.id) || []
      });
      // Importante: para editar senha, o backend deve ter um endpoint separado ou tratativa específica.
      // Não preencha o campo de senha diretamente na edição por segurança.
    }
  }

  // Método para lidar com a seleção/desseleção de permissões (se precisar de checkboxes individuais)
  onPermissaoChange(permissaoId: number, isChecked: boolean): void {
    const permissoesIds = this.userForm.get('permissoesIds')?.value as number[];
    if (isChecked) {
      this.userForm.get('permissoesIds')?.setValue([...permissoesIds, permissaoId]);
    } else {
      this.userForm.get('permissoesIds')?.setValue(permissoesIds.filter(id => id !== permissaoId));
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.getRawValue(); // Use getRawValue() para pegar valores de campos desabilitados

      if (this.isEditMode) {
        // Para edição, remova 'id' e 'senha' se não for alterada
        const updateDto: UpdateUserDto = {
          nome: formValue.nome,
          email: formValue.email,
          cargo: formValue.cargo,
          ativo: formValue.ativo,
          permissoesIds: formValue.permissoesIds // Inclui IDs de permissões
        };
        // Se a senha for explicitamente alterada (requer um campo de 'nova senha' e lógica no backend)
        // if (formValue.novaSenha) { updateDto.senha = formValue.novaSenha; }

        this.dialogRef.close({ id: formValue.id, ...updateDto });
      } else {
        // Para criação, use CreateUserDto
        const createDto: CreateUserDto = {
          nome: formValue.nome,
          email: formValue.email,
          senha: formValue.senha, // Senha é enviada apenas na criação
          cargo: formValue.cargo,
          ativo: formValue.ativo,
          permissoesIds: formValue.permissoesIds // Inclui IDs de permissões
        };
        this.dialogRef.close(createDto);
      }
    } else {
      this.userForm.markAllAsTouched(); // Marca todos os campos como tocados para exibir erros
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Fecha o modal sem retornar dados
  }
}
