import * as types from './types'

export interface IPublicUser {
    username: types.username
    name: types.name
    lastname: types.lastname
    avatar: types.avatar
    theme: types.theme
}

export interface IRegisterBody {
    username: types.username
    password: types.password
    name: types.name
    lastname: types.lastname
}

export interface IAllUserData {
    id: types.userId,
    password: types.password,
    name: types.name,
    lastname: types.lastname,
    avatar: types.avatar,
    username: types.username,
    theme: types.theme,
    expires: types.expires
}