import {theme} from "./types";

export interface IPublicUser {
    username: string
    name: string
    lastname: string
    avatar: string
    theme: theme
}

export interface IRegisterBody {
    username: string
    password: string
    name: string
    lastname: string
}