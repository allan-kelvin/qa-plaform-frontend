import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NomePermissao, User } from '../core/models/user.model';
import { UserService } from '../features/user.service';
import { UserFormComponent } from './user-form/user-form.component';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    RouterModule,
    MatDialogModule,
    FormsModule,
    MatPaginatorModule,
    MatFormFieldModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})

export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'cargo', 'permissoes', 'ativo'];
  dataSource!: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.snackBar.open('Erro ao carregar usuários. Tente novamente.', 'Fechar', { duration: 5000 });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPermissoesString(permissoes?: NomePermissao[] | { nome: NomePermissao }[]): string {
    if (!permissoes || permissoes.length === 0) {
      return 'Nenhuma';
    }

    if (typeof permissoes[0] === 'object' && 'nome' in permissoes[0]) {
      return (permissoes as { nome: NomePermissao }[]).map(p => p.nome).join(', ');
    }

    return (permissoes as NomePermissao[]).join(', ');
  }

  openUserForm(user?: User): void {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.userService.updateUser(result.id, result).subscribe({
            next: (updatedUser) => {
              this.snackBar.open('Usuário atualizado com sucesso!', 'Fechar', { duration: 3000 });
              this.loadUsers();
            },
            error: (err) => {
              console.error('Erro ao atualizar usuário:', err);
              this.snackBar.open('Erro ao atualizar usuário. Detalhes: ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
            }
          });
        } else {
          this.userService.createUser(result).subscribe({
            next: (newUser) => {
              this.snackBar.open('Usuário adicionado com sucesso!', 'Fechar', { duration: 3000 });
              this.loadUsers();
            },
            error: (err) => {
              console.error('Erro ao adicionar usuário:', err);
              this.snackBar.open('Erro ao adicionar usuário. Detalhes: ' + (err.error?.message || err.message), 'Fechar', { duration: 5000 });
            }
          });
        }
      }
    });
  }

  onToggleActive(user: User): void {
    const updatePayload = { ativo: user.ativo };

    this.userService.updateUser(user.id, updatePayload).subscribe({
      next: (updatedUser) => {
        this.snackBar.open(`Usuário ${updatedUser.nome} ${updatedUser.ativo ? 'ativado' : 'desativado'}!`, 'Fechar', { duration: 3000 });
      },
      error: (err) => {
        console.error('Erro ao mudar status de ativo:', err);
        user.ativo = !user.ativo;
        this.snackBar.open('Erro ao atualizar status do usuário. Tente novamente.', 'Fechar', { duration: 5000 });
      }
    });
  }

  deleteUser(user: User): void {
    if (confirm(`Tem certeza que deseja excluir o usuário ${user.nome}?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Usuário excluído com sucesso!', 'Fechar', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          console.error('Erro ao excluir usuário:', err);
          this.snackBar.open('Erro ao excluir usuário. Tente novamente.', 'Fechar', { duration: 5000 });
        }
      });
    }
  }
}
