import { Event } from "src/events/events.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PaymentStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED'
}

@Entity()
export class Payment {
    @PrimaryGeneratedColumn('uuid')
        id: string

    @ManyToOne(() => User, { eager: true })
        user: User

    @ManyToOne(() => Event, { eager: true })
        event: Event
    
    @Column()
        amount: number

    @Column({ unique: true })
        reference: string

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
        status: PaymentStatus

    @CreateDateColumn()
        createdAt: Date
}