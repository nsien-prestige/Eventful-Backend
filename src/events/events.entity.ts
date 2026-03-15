import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED'
}

@Entity()
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true }) 
    description: string;
    
    @Column({
        type: 'enum',
        enum: EventStatus,
        default: EventStatus.ACTIVE
    })
    status: EventStatus;

    @Column({ unique: true })
    publicId: string;

    @Column({ type: 'timestamptz' })
    date: Date;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ nullable: true })
    category: string;

    @Column({ type: 'int', default: 0 })
    viewCount: number;

    @Column({ type: 'int', nullable: true })
    capacity: number;

    @Column({ type: 'timestamptz', nullable: true })
    endDate: Date;

    @Column({ nullable: true })
    organizer: string;

    @Column({ nullable: true })
    eventType: string;

    @Column({ type: 'text', nullable: true })
    summary: string;

    @Column({ nullable: true })
    venueAddress: string;

    @Column({ nullable: true })
    locationType: string; 

    @Column({ nullable: true })
    meetingLink: string;

    @Column({ type: 'float', precision: 10, scale: 6, nullable: true })
    latitude: number;

    @Column({ type: 'float', precision: 10, scale: 6, nullable: true })
    longitude: number;

    @Column({ nullable: true })
    refundPolicy: string;

    @Column({ type: 'jsonb', nullable: true })  
    agenda: any[];

    @Column({ type: 'jsonb', nullable: true }) 
    tickets: any[];

    @ManyToOne(() => User, user => user.events, {
        eager: true,
        onDelete: 'CASCADE'
    })
    creator: User;
}