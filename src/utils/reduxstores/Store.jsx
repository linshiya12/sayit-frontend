import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./Authslice";

export const store=configureStore({
    reducer:{
        auth:authreducer
    }
})