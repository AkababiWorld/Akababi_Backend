import { CreateDateColumn, Column } from "typeorm";
import { Privacy } from "../..";

export abstract class UserMultimedia {
	@CreateDateColumn({
		name: "created_at"
	})
	createdAt: Date;

	@Column()
	path: string;

	@Column({
		type: "enum",
		enum: Privacy,
		default: Privacy.Everyone
	})
	privacy: Privacy;
}