import { Entity, ObjectIdColumn, ObjectId, Column } from "typeorm";

@Entity()
export class User {
    @ObjectIdColumn()
    id!: ObjectId;

    @Column({ type: "string" })
    username!: string;

    @Column({ type: "string", unique: true })
    email!: string;

    @Column({ type: "string" })
    password!: string;
}