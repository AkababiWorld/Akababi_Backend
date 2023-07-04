import { LocationType, Privacy } from "../../entity"
import { Post } from "../../entity/post/post.entity"
import { User } from "../../entity/user/user.entity"
import { postRepo } from "../post"
import { userRepo } from "../user"

export default {
	discoverUser: async ({ longitude, latitude }: LocationType, radius: number): Promise<(User | any)[]> => {
		const users = await userRepo
			.createQueryBuilder("user")
			.leftJoinAndSelect("user.profile", "user_profile")
			.leftJoinAndSelect("user_profile.profilePicture", "profile_picture")
			.leftJoinAndSelect("profile_picture.picture", "user_picture")
			.where("ST_Distance_Sphere(user.location, ST_GeomFromText(:point, 4326)) <= :radius", {
				point: `POINT(${longitude} ${latitude})`,
				radius
			})
			.getMany()

		return users.map((user: User | any) => {
			if (user.profile.profilePicture.privacy === Privacy.Everyone)
				user.profilePicture = user.profile.profilePicture.picture.path

			user.gender = user.profile.gender
			delete user.profile

			return user
		})
	},
	discoverPost: async ({ longitude, latitude }: LocationType, radius: number): Promise<Post[]> => {
		return await postRepo
			.createQueryBuilder("post")
			.where("ST_Distance_Sphere(post.location, ST_GeomFromText(:point, 4326)) <= :radius", {
				point: `POINT(${longitude} ${latitude})`,
				radius
			})
			.getMany()
	}
}