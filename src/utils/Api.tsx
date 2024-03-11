import { GROUPS_LIST } from "../mock/groups";
import { GetGroupsResponse } from "./InterfaceApiGroups";

const groupResponse: GetGroupsResponse = {
  result: 1,
  data: GROUPS_LIST
}

export const getGroups = () =>
  new Promise((resolve, reject) => {
    if (!groupResponse.data || groupResponse.result === 0) {
      reject(new Error('Users not found'));
    }

    setTimeout(() => {
      resolve(groupResponse.data);
    }, 1000)
  });