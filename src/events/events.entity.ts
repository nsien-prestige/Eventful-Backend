import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "src/users/users.entity";

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED'
}

@Entity('event')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text' })
    summary: string;

    @Column()
    organizer: string;

    @Column({ nullable: true })
    eventType: string;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'timestamp with time zone' })
    date: Date;

    @Column({ type: 'timestamp with time zone', nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    venueAddress: string;

    @Column({ nullable: true })
    locationType: string;

    @Column({ nullable: true })
    meetingLink: string;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
    longitude: number;

    @Column({ type: 'jsonb', nullable: true, default: '[]' })
    agenda: any[];

    @Column({ type: 'jsonb', nullable: true, default: '[]' })
    tickets: any[];

    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.ACTIVE
    })
    status: EventStatus;

    @Column({ unique: true })
    publicId: string;

    @Column({ default: 0 })
    viewCount: number;

    @Column({ nullable: true })
    capacity: number;

    @Column({ nullable: true })
    refundPolicy: string;

    @ManyToOne(() => User, user => user.events, { onDelete: 'CASCADE' })
    creator: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}