import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/users.entity";

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    CANCELLED = 'CANCELLED',
    CLOSED = 'CLOSED'
}

@Entity()
export class Event {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({ type: 'int' })
    price: number

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.ACTIVE
    })
    status: EventStatus

    @Column({ unique: true })
    publicId: string

    @Column({ type: 'timestamptz' })
    date: Date

    @Column({ nullable: true })
    imageUrl: string

    @Column({ nullable: true })
    category: string

    @Column({ type: 'int', default: 0 })
    viewCount: number

    @Column({ type: 'int', nullable: true })
    capacity: number

    @Column({ type: 'timestamptz', nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    location: string;

    @Column({ default: false })
    isOnline: boolean;

    @Column({ nullable: true })
    meetingLink: string;

    @Column({ nullable: true })
    refundPolicy: string;

    @ManyToOne(() => User, user => user.events, {
        eager: true,
        onDelete: 'CASCADE'
    })
    creator: User
}
