import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column()
    username!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;
}