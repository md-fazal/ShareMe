import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";

const Feed = () => {
	const [loading, setLoading] = useState(false);
	const { categoryId } = useParams();
	const [pins, setPins] = useState([]);

	console.log(pins)
	useEffect(() => {
		setLoading(true);
		if (categoryId) {
			const query = searchQuery(categoryId);
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			client.fetch(feedQuery).then((data) => {
				setPins(data);
        console.log(data);
				setLoading(false);
			});
		}
	}, [categoryId]);

	console.log(pins)

	if (loading)
		return <Spinner message="We are adding new ideas to your Feed!!" />;

	if(!pins.length){
		return <div className="flex justify-center font-bold items-center w-full text-xl"><h2>No Pins Found!!</h2></div>
	}


	return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
