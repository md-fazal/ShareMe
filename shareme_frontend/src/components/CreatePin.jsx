import React from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { TiTickOutline } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
	const [title, setTitle] = useState("");
	const [about, setAbout] = useState("");
	const [destination, setDestination] = useState("");
	const [loading, setLoading] = useState(false);
	const [allFieldsFilled, setAllFieldsFilled] = useState(false);
	const [category, setCategory] = useState(null);
	const [imageAsset, setImageAsset] = useState(null);
	const [wrongImageType, setWrongImageType] = useState(false);
	const [uploadFailed, setUploadFailed] = useState(false);

	const calcAllFildsFilled = () => {
		setAllFieldsFilled(
			title !== "" &&
				about !== "" &&
				destination !== "" &&
				category !== null &&
				imageAsset !== null
		);
		console.log(allFieldsFilled);
	};

	const uploadImage = (e) => {
		const selectedFile = e.target.files[0];
		if (
			selectedFile.type === "image/png" ||
			selectedFile.type === "image/jpeg" ||
			selectedFile.type === "image/gif" ||
			selectedFile.type === "image/svg" ||
			selectedFile.type === "image/tiff"
		) {
			setWrongImageType(false);
			setLoading(true);
			client.assets
				.upload("image", selectedFile, {
					contentType: selectedFile.type,
					filename: selectedFile.name,
				})
				.then((document) => {
					setImageAsset(document);
					console.log(document);
					setLoading(false);
				})
				.catch((error) => setUploadFailed(true));
		} else {
			setWrongImageType(true);
		}
	};

	const savePin = () => {
		if (
			title !== "" &&
			about !== "" &&
			destination !== "" &&
			category !== null &&
			imageAsset !== null
		) {
			const doc = {
				_type: "pin",
				title: title,
				about: about,
				destination: destination,
				category: category,
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: imageAsset._id,
					}
				}, 
				userId: user._id,
				postedBy: {
					_ref: user._id,
					_type: "postedBy",
				},
				save: [],
				comments: [],
			};
			client.create(doc).then(()=>(navigate('/')))
		}

	};

	const navigate = useNavigate();

	return (
		<div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
			{!allFieldsFilled ? (
				<p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in font-semibold">
					Please fill all fields
				</p>
			) : (
				<p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in font-semibold">
					{}
				</p>
			)}
			<div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:pd-5 pd-3 lg:w-4/5 w-full">
				<div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
					<div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
						{loading && <Spinner />}
						{wrongImageType && (
							<p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in font-semibold">
								Wrong image type
							</p>
						)}
						{uploadFailed && (
							<p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in font-semibold">
								upload Failed
							</p>
						)}
						{imageAsset === null ? (
							<label>
								<div className="flex flex-col justify-center h-full items-center cursor-pointer">
									<div className="flex flex-col justify-center items-center">
										<p className="font-bold text-2xl">
											<AiOutlineCloudUpload
												fontSize={55}
											/>
										</p>
										<p className="text-lg">
											click to upload
										</p>
									</div>
									<p className="mt-32 text-gray-400">
										use high quality JPG, SVG, GIF or TIFF
										less than 20 mb
									</p>
								</div>
								<input
									type="file"
									name="upload-image"
									onChange={(e) => uploadImage(e)}
									className="w-0 h-0"
								/>
							</label>
						) : (
							<div className="relative h-full">
								<img
									className="h-full w-full"
									src={imageAsset?.url}
									alt="uploaded-image"
								/>
								{/* <p className="text-green-500 mb-5 text-xl transition-all duration-150 ease-in font-semibold">
              upload successful
            </p> */}
								<button
									type="button"
									className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
									onClick={(e) => setImageAsset(null)}
								>
									<MdDelete />
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
					<input
						type="text"
						value={title}
						onChange={(e) => {
							setTitle(e.target.value);
						}}
						placeholder="Add your title"
						className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
					/>
					{user && (
						<div className="flex gap-2 my-2 items-center bg-white rounded-lg">
							<img
								src={user.image}
								alt="user-profile"
								className="w-10 h-10 rounded-full"
							/>
							<p className="font-bold">{user.userName}</p>
						</div>
					)}
					<input
						type="text"
						onChange={(e) => {
							setAbout(e.target.value);
						}}
						placeholder="What is you pin about"
						className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
					/>
					<input
						type="text"
						value={destination}
						onChange={(e) => {
							setDestination(e.target.value);
						}}
						placeholder="Set a destination link"
						className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
					/>
					<div className="flex flex-col">
						<div>
							<p className="mb-2 font-semibold text-lg sm:text-xl">
								Choose Pin Category
							</p>
							<select
								onChange={(e) => {
									setCategory(e.target.value);
								}}
								className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
								name=""
								id=""
							>
								<option value={null} className="bg-white">
									Select Category
								</option>
								{categories.map((category) => (
									<option className="text-base border-0 outline-none capitalize bg-white text-black">
										{category.name}
									</option>
								))}
								<option value="other" className="bg-white">
									other
								</option>
							</select>
						</div>
						<div className="flex justify-end items-end mt-5">
							<button
								type="button"
								onClick={() => {
									savePin();
									calcAllFildsFilled();
								}}
								className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
							>
								Save Pin
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreatePin;
