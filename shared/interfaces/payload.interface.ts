import { User } from "@prisma/client"

export interface IPayload {
    sub: User["ID"],
    email: User["email"],
    role: User["role"]
    status: User["status"]
}

export interface IAccressToken {
    accessToken: string
}