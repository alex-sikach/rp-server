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