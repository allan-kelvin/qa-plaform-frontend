export enum CargoUsuario {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  TECH_LEAD = 'TECH_LEAD',
  QA_SENIOR = 'QA_SENIOR',
  QA_JUNIOR = 'QA_JUNIOR',
  SUPORTE = 'SUPORTE',
  PO = 'PO',
  DESENVOLVEDOR = 'DESENVOLVEDOR',
  QA_PLENO = "QA_PLENO",
  QA_JR = "QA_JR",
}

export enum NomePermissao {
  VISUALIZAR = 'visualizar',
  INCLUIR = 'incluir',
  EDITAR = 'editar',
  EXCLUIR = 'excluir',
  OBSERVADOR = 'observador',
  GERENCIAR_PERMISSOES = 'gerenciar_permissoes',
}

// Interface para as permissões (pode ser mais detalhada se o backend retornar mais campos)
export interface Permissao {
  id: number;
  nome: NomePermissao;
  // Adicione outros campos da sua entidade Permissao, se houver
}

// Interface principal para o usuário, mapeando para sua entidade do NestJS
export interface User {
  id: number;
  nome: string; // Corresponde a 'nome' no backend
  email: string;
  cargo: CargoUsuario; // Corresponde a 'cargo' (enum)
  ativo: boolean; // Corresponde a 'ativo'
  criado_em: Date;
  atualizado_em: Date;
  permissoes?: Permissao[];

}

// DTO para criação de usuário (sem id, criado_em, atualizado_em)
export interface CreateUserDto {
  nome: string;
  email: string;
  senha?: string; // Senha é enviada na criação, mas não na listagem/edição simples
  cargo: CargoUsuario;
  ativo: boolean;
  permissoesIds?: number[]; // Se você for enviar IDs de permissões na criação/edição
}

// DTO para atualização de usuário (todos os campos opcionais)
export interface UpdateUserDto {
  nome?: string;
  email?: string;
  senha?: string;
  cargo?: CargoUsuario;
  ativo?: boolean;
  permissoesIds?: number[];
}
