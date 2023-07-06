import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import jwt_decode from "jwt-decode";

import { client } from "../client";
import { useNavigate } from "react-router";

const Login = () => {
	const navigate = useNavigate();

	const responseGoogle = (response) => {
		response.googleId = response.sub;
		localStorage.setItem("user", JSON.stringify(response));
		console.log(response);

		const { name, googleId, picture } = response;
		const imageUrl = picture;
		console.log(name, googleId, imageUrl);

		const doc = {
			_id: googleId,
			_type: "user",
			userName: name,
			image: imageUrl,
		};

		client.createIfNotExists(doc).then(() => {
			navigate("/", { replace: true });
		});
	};

	return (
		<div className="flex justify-start items-center flex-col h-screen">
			<div className="relative w-full h-full">
				<video
					src={shareVideo}
					loop
					muted
					controls={false}
					autoPlay
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
				<div className="p-5">
					<img src={logo} width="130px" alt="logo" />
				</div>
				<div className="shadow-2xl">
					<GoogleOAuthProvider
						clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
					>
						<GoogleLogin
							onSuccess={(credentialResponse) => {
								console.log(credentialResponse);
								responseGoogle(
									jwt_decode(credentialResponse.credential)
								);
							}}
							onError={() => {
								console.log("Login Failed");
							}}
						/>
					</GoogleOAuthProvider>
				</div>
			</div>
		</div>
	);
};

export default Login;
