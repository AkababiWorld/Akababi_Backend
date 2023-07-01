import { Application, Router } from "express";
import { RouteConfig } from "../lib/route.config";
import user from "../controller/user";
import { jwtCheck } from "../middleware/jwt_check";
import { IncludeUser } from "../middleware/include_user";
import { IncludeLocation } from "../middleware/include_location";
import profile from "../controller/user/profile";
import { checkSchema } from "express-validator"
import { upload } from "../lib/file_upload";
import { MaritalStatus, Privacy } from "../entity";

export default class UserRoute extends RouteConfig {
	profile: Router

	constructor(app: Application) {
		super(app, "User Route")
	}

	registerRoute(): void {
		this.profile = Router()
		this.router.use(IncludeLocation)

		this.router.use("/profile", this.profile) // ---> api/user/profile
		this.app.use("/api/user", this.router) // ---> api/user
	}

	configureRoutes(): void {
		this.router.route("/is-new-user") // ---> api/user/is-new-user
			.get(jwtCheck, IncludeUser, user.isNewUser)

		this.profile.route("/self") // ---> api/user/profile/self
			.get(jwtCheck, IncludeUser, profile.readSelfProfile)
			.put(
				jwtCheck, IncludeUser,
				upload.single('profile_picture'),
				checkSchema({
					first_name: { notEmpty: true, optional: true, isAlpha: true, escape: true },
					last_name: { notEmpty: true, optional: true, isAlpha: true, escape: true },
					birthday: { notEmpty: true, optional: true, isDate: true, escape: true },
					marital_status: {
						notEmpty: true, optional: true, isIn: {
							options: Object.values(MaritalStatus)
						},
						escape: true
					},
					nationality: { notEmpty: true, optional: true, isAlpha: true, escape: true },
					profile_privacy: {
						notEmpty: true, optional: true, isIn: {
							options: Object.values(Privacy)
						},
						escape: true
					},
					interests: {
						notEmpty: true, optional: true, isString: true, escape: true }
				}, ['body']),

				profile.updateSelfProfile
			)
	} // configure routes
}