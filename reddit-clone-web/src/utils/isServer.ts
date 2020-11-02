import { type } from "os";

export const isServer = () => typeof window === "undefined";
