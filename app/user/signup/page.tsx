// "use client" for frontend code 
"use client";
import { signup } from "@/action/useraction";
import { User } from "@/db/schema";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

// react hook form
const page = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<User>();

  // calling signup function
  const onSubmit: SubmitHandler<User> = async(data) => {
    await signup(data)
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
  
        {/* include validation with required or other standard HTML validation rules */}
        <input {...register("name", { required: true })} placeholder="enter name"/>
        {/* errors will return when field validation fails  */}
        {errors.name && <span>This field is required</span>}

        <input {...register("email", { required: true })} placeholder="enter email"/>
        {/* errors will return when field validation fails  */}
        {errors.email && <span>This field is required</span>}

        <input {...register("password", { required: true })} placeholder="enter password"/>
        {/* errors will return when field validation fails  */}
        {errors.password && <span>This field is required</span>}
        <input type="submit" />
      </form>
    </div>
  );
};

export default page;
