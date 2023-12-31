import React from "react";
import { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetail = ({ user }) => {
	const [pins, setPins] = useState([]);
	const [pinDetail, setPinDetail] = useState(null);
	const [comment, setComment] = useState("");
	const [addingComment, setAddingComment] = useState(false);

	const { pinId } = useParams();

	const addComment = () => {
		if (comment !== "") {
			setAddingComment(true);
			client
				.patch(pinDetail._id)
				.setIfMissing({ comments: [] })
				.insert("after", "comments[-1]", [
					{
						comment,
						_key: uuidv4,
						postedBy: {
							_type: "postedBy",
							_ref: user._id,
						},
					},
				])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment("");
					setAddingComment(false);
				});
		}
	};

	const fetchPinDetails = () => {
		let query = pinDetailQuery(pinId);
		console.log("here");

		if (query) {
			client.fetch(query).then((data) => {
				if (data.length > 0) {
					setPinDetail(data[0]);
					query = pinDetailMorePinQuery(data[0]);
          console.log(query)
					client.fetch(query).then((res) => setPins(res));
				}
			});
		}
	};

	useEffect(() => {
		fetchPinDetails();
	}, [pinId]);

	if (!pinDetail) return <Spinner message={"Loading pin...."}></Spinner>;

	return (
		<>
			<div
				className="flex xl:flex-grow flex-col m-auto bg-white"
				style={{ maxWidth: "1500px", borderRadius: "32px" }}
			>
				<div className="flex justify-center items-center md:items-start flex-initial">
					<img
						src={urlFor(pinDetail?.image).url()}
						alt="user-post"
						className="rounded-t-3xl rounded-b-lg"
					/>
				</div>
				<div className="w-full p-5 flex-1 xl:min-w-620">
					<div className="flex items-center justify-between">
						<div className="flex gap-2 items-center">
							<a
								href={`${pinDetail.image.asset.url}?dl=`}
								download
								onClick={(e) => e.stopPropagation()}
							>
								<MdDownloadForOffline className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none" />
							</a>
						</div>
						<a
							href={pinDetail.destination}
							target="_blank"
							rel="noreferrer"
						>
							{pinDetail.destination}
						</a>
					</div>

					<div>
						<h1 className="text-4xl font-bold break-words mt-3">
							{pinDetail.title}
						</h1>
						<p className="mt-3">{pinDetail.about}</p>
					</div>
					<Link
						to={`user-profile/${pinDetail.postedBy._id}`}
						className="flex gap-2 mt-5 items-center bg-white rounded-lg"
					>
						<img
							src={pinDetail.postedBy.image}
							alt="user-profile "
							className="w-8 h-8 rounded-full object-cover"
						/>
						<p className="font-semibold capitalize">
							{pinDetail.postedBy.userName}
						</p>
					</Link>
					<h2 className="mt-5 text-2xl">Comments:</h2>
					<div className="max-h-370 overflow-y-auto">
						{pinDetail.comments?.map((comment, i) => (
							<div
								className="flex gap-2 mt-5 items-center bg-white rounded-lg"
								key={i}
							>
								<img
									className="w-10 h-10 rounded-full cursor-pointer"
									src={comment.postedBy?.image}
									alt="user-image"
								/>
								<div className="flex flex-col ml-2">
									<p className="font-bold">
										{comment.postedBy.userName}
									</p>
									<p>{comment.comment}</p>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-wrap mt-6 gap-3">
						{user && (
							<Link to={`user-profile/${user._id}`}>
								<img
									src={user.image}
									alt="user-profile "
									className="w-8 h-8 rounded-full cursor-pointer mt-2"
								/>
							</Link>
						)}
						<input
							type="text"
							className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
							placeholder="add a comment.."
							value={comment}
							onChange={(e) => setComment(e.target.value)}
						/>
						<button
							type="button"
							className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
							onClick={() => addComment()}
						>
							{addingComment ? "Posting a comment..." : "Post"}
						</button>
					</div>
				</div>
			</div>
      {console.log(pins)}
			{pins.length > 0 ? ( 
				<>
					<h2 className="text-center font-bold text-2xl mt-8 mb-4">
						More Like This
					</h2>
          <MasonryLayout pins={pins}/>
				</>
			) : (
				<Spinner message="loading more pins"></Spinner>
			)}
		</>
	);
};

export default PinDetail;
