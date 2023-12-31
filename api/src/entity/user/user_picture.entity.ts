import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserMultimedia } from "./helper/user_multimedia";
import { UserPictureCategory } from "./user_picture_category.entity";

@Entity()
export class UserPicture extends UserMultimedia {
	@PrimaryGeneratedColumn({
		name: "user_picture_id"
	})
	id: number;


	/**
	 * Relations
	 */
	@ManyToOne(() => UserPictureCategory, userPictureCategory => userPictureCategory.pictures)
	@JoinColumn({
		name: "user_picture_category_id"
	})
	category: UserPictureCategory;
}