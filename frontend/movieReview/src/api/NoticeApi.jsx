import jwtAxios from "../util/jwtUtil";
import { API_SERVER_HOST } from "./memberApi";

//서버 주소
const host = `${API_SERVER_HOST}/api/notices`;

// 선택
export const getOne = async (id) => {
  const res = await jwtAxios.get(`${host}/${id}`);

  return res.data;
}

// 전체리스트(페이징)
export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await jwtAxios.get(host, {
    params: { page: page, size: size },
  });

  return res.data;
};

// 삽입
export const postAdd = async (notice) => {
  //파일업로드 할때에는 기본값인 ‘Content-Type’: ‘application/json’을 ‘multipart/form-data’ 변경해야됨
  const header = { headers: { 'Content-Type': 'multipart/form-data' } };
  const res = await jwtAxios.post(host, notice, header);

  return res.data;
};

// 삭제
export const deleteOne = async (id) => {
  const res = await jwtAxios.delete(`${host}/${id}`);

  return res.data;
}

// 수정
export const putOne = async (id, notice) => {
  const header = { headers: { "Content-Type": "multipart/form-data" } };
  const res = await jwtAxios.put(`${host}/${id}`, notice, header);

  return res.data;
}