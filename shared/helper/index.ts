
import { IPayload } from "../interfaces/payload.interface";

export function getPayload(user: any): IPayload {
    return {
        sub: user.ID,
        email: user.email,
        role: user.role,
        status: user.status
    }
}