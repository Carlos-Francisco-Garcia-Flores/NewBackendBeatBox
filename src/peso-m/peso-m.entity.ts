import { PerfilUsuarios } from "src/perfil_usuario/perfil_usuario.entity";
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pesosM') // nombre explícito para la tabla
export class PesoM {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float' }) // cambio a tipo numérico
    peso: number;

    @Column({ type: 'date', nullable: true })
    fecha: Date;

    @ManyToOne(() => PerfilUsuarios, perfil => perfil.pesos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'idperfil' }) // nombre más claro de columna foránea
    perfil: PerfilUsuarios;
}
