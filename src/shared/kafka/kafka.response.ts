export const kafkaResponseParser = async (stream: Promise<any>) => {
    const result = await stream
    return JSON.parse(JSON.stringify(result))
}