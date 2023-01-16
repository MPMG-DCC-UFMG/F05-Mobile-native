import { environment } from "../../enviroment";
import client from "./client";

const apiParam = "?X-TRENA-KEY=" + environment.apiKey

const endpoint = "/notification/" + apiParam;

const comments_endpoint = "/notification/comments/all/" + apiParam;

const getNotifications = () => client.get(endpoint)

const getComments = () => client.get(comments_endpoint)

export default {
    getNotifications,
    getComments
};

