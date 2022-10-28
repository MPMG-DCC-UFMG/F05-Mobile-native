import { environment } from "../../enviroment"
import client from "./client"

const apiParam = "?X-TRENA-KEY=" + environment.apiKey


//TODO fix @ mapping to %40
const login = (email: string, password: string) => client.post("/security/users/login" + apiParam, `grant_type=&username=${email}&password=${password}&scope=&client_id=&client_secret=`)
// const login = (email: string, password: string) => client.post("/auth", {email, password })

export default {
  login
}