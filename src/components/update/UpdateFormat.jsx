import React from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
import { getFormats } from "../../api/api";
import Loading from "../animation/Loading";

const UpdateFormat = () => {
  // const queryClient = useQuery();

  // const {
  //   data: response,
  //   isLoading,
  //   error,
  //   isError,
  // } = useQuery({
  //   queryKey: ["formats"],
  //   queryFn: getFormats,
  // });

  // const formats = response?.data || [];
  // if (isLoading) return <Loading />;
  // if (isError) return <p>Error:{error}</p>;
  // if (!isLoading && !isError && formats.length == 0)
  //   return <p>No formats found</p>;

  return <div>UpdateFormat</div>;
};

export default UpdateFormat;
