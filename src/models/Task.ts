import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn()
    id!: number; // Requisito: id (número)

    @Column({ length: 100, nullable: false })
    titulo!: string; // Requisito: titulo (string)

    @Column({ type: 'text', nullable: true })
    descricao?: string; // Requisito: descricao (opcional)

    @Column({ default: false })
    concluida!: boolean; // Requisito: concluida (boolean)

    @CreateDateColumn()
    dataCriacao!: Date; // Requisito: dataCriacao (datetime automática)

    // Relacionamos a tarefa a um usuário para que cada um tenha a sua lista
    @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
    user!: User;

    constructor(titulo: string, concluida: boolean, user: User, descricao?: string) {
        this.titulo = titulo;
        this.concluida = concluida;
        this.user = user;
        this.descricao = descricao;
    }
}