import { catchError, of } from "rxjs"
import { kafkaResponseParser } from "./kafka.response"
import { HttpException, HttpStatus } from "@nestjs/common"
import { ClientKafka } from "@nestjs/microservices"

export async function sendMessage(client: ClientKafka, topic: string, data: any, exceptionStatus: HttpStatus) {
    const stream = new Promise((resolve, reject) => {
        client
            .send(topic, JSON.stringify(data))
            .pipe(catchError(val => of({ error: val.message })))
            .subscribe(message => resolve(message))
    })
    const response = await kafkaResponseParser(stream)

    if (response.hasOwnProperty('error'))
        throw new HttpException(response.error, exceptionStatus)
    return response
}