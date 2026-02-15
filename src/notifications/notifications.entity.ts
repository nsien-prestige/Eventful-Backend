import { Event } from "src/events/events.entity";
import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
        id: string

    @ManyToOne(() => User)
        user: User

    @ManyToOne(() => Event)
        event: Event

    @Column()
        type: 'EVENT_REMINDER'

    @Column({ type: 'timestamptz'})
        scheduledFor: Date

    @Column({ default: false })
        sent: boolean

    @Column({ type: 'timestamptz', nullable: true })
        sentAt: Date
}