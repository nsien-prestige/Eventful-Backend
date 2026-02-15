import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../auth/enums/role.enum";
import { Event } from "../events/events.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
        id: string

    @Column({ unique: true })
        email: string
    
    @Column()
        username: string

    @Column({ select: false})
        password: string

    @Column({
        type: 'enum',
        enum: UserRole,
        array: true,
        default: [UserRole.EVENTEE]
    })
        roles: UserRole[]

    @OneToMany(() => Event, event => event.creator)
        events: Event[]
}