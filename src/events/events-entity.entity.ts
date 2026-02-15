import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Event } from "./events.entity";

@Unique(['user', 'event'])
@Entity()
export class EventAttendee {
    @PrimaryGeneratedColumn('uuid')
        id: string

    @ManyToOne(() => User, {
        eager: true,
        onDelete: 'CASCADE'
    })
        user: User

    @ManyToOne(() => Event, {
        eager: true,
        onDelete: 'CASCADE'
    })
        event: Event

    @Column({ unique: true })
        qrHash: string

    @Column({ type: 'timestamp', nullable: true })
        scannedAt: Date

    @CreateDateColumn()
        attendedAt: Date
}