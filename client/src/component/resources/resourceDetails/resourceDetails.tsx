import React from "react";
import { Resource } from "../../../types/resource";
import Tab from "./tab";
import { useNavigate } from "react-router-dom";

export default function ResourceDetails({ resource }: { resource: Resource }) {
  //console.log("in resource detail: ", resource);
  const mediumList = resource.medium.map((medium) => medium.format);
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4 text-center sm:text-left">
      <h1 className="mb-4 text-3xl font-bold">{resource.title}</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <div className="flex h-full flex-col justify-between">
          {/* Top left box */}
          <div className="flex flex-col gap-2">
            <p className="mb-2 font-bold text-gray-700">
              Available in {mediumList.join(", ")}
            </p>
            <span className="text-gray-500">{resource.shortDescription}</span>
            <span className="mb-2 inline-block rounded-md bg-green-500 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white">
              Category: {resource.category.join(", ")}
            </span>
          </div>
        </div>
        {/* Top right box */}
        <div className="w-full">
          <img
            src={resource.thumbnail_url}
            alt={resource.title}
            className="mx-auto h-auto w-40 max-w-md rounded-md object-cover"
          />
        </div>
      </div>
      <div className="mt-8">
        {/* Tabs */}
        <Tab resource={resource} />
      </div>
      <br />
      <button className="disabled:opacity-50 bg-gray-200 text-black py-2 px-4 rounded-md shadow-md hover:bg-gray-100"onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
