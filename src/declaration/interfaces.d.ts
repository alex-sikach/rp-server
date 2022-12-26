export interface IPublicUser {
    username: string
    name: string
    lastname: string
    avatar: string
}

export interface IRegisterBody {
    username: string
    password: string
    name: string
    lastname: string
}