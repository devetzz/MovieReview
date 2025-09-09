import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginPost } from "../api/memberApi.jsx";
import { setCookie, getCookie, removeCookie } from "../util/cookieUtil.jsx";

const initState = {
  email: "",
};

// 로그인 성공 시 member 정보를 쿠키에 저장하는 함수
const saveMemberToCookie = (memberInfo) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 1); // 쿠키 유효기간 1일로 설정
  setCookie("member", JSON.stringify(memberInfo), 1);
};

export const loginPostAsync = createAsyncThunk("loginPostAsync", async (param) => {
  const res = await loginPost(param);
  saveMemberToCookie(res); // 로그인 성공 시 쿠키에 저장
  return res;
});

const loginSlice = createSlice({
  name: "LoginSlice",
  initialState: getCookie("member") || initState, // 페이지 로드 시 쿠키에서 로그인 정보 읽어오기
  reducers: {
    login: (state, action) => {
      const data = action.payload;
      saveMemberToCookie(data);
      return { email: data.email };
    },
    logout: (state, action) => {
      removeCookie("member");
      return { ...initState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginPostAsync.fulfilled, (state, action) => {
        console.log("fulfilled : 완료");
        const payload = action.payload;
        // 서버 응답에 토큰이 포함되어 있다면 쿠키에 저장
        if(payload.accessToken) {
            saveMemberToCookie(payload);
        }
        return payload;
      })
      .addCase(loginPostAsync.pending, (state, action) => {
        console.log("pending : 처리중");
      })
      .addCase(loginPostAsync.rejected, (state, action) => {
        console.log("rejected : 오류");
      });
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;