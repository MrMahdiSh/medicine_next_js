export default function errorMessage(message) {
    return parseInt(message.split(":")[1].trim(), 10);
}