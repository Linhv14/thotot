import { User } from "@prisma/client";
import { IPayload } from "shared/interfaces/payload.interface";

export function getPayload(user: User): IPayload {
    return {
        sub: user.ID,
        email: user.email,
        role: user.role,
        status: user.status
    }
}