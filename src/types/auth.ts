// 회원가입
export interface SignupRequest {
  loginId: string;
  password?: string;
  email: string;
}

// 서버 응답 공통 구조 (isSuccess, message 등)
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

//회원가입 성공 시 서버가 돌려주는 결과 데이터
export interface SignupResult {
  memberId: number;
  loginId: string;
  email: string;
  createdAt: string;
}

// 로그인
export interface LoginRequest {
  loginId: string;
  password: string;
}

//  로그인 성공 시 결과 데이터
export interface LoginResult {
  grantType: string;
  accessToken: string;
  accessTokenExpiresAt: string; // "2026-05-12T05:18:31.069Z" 형태
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

// 토큰 재발급 결과 데이터 (Result)
// 로그인 결과와 구조가 같으므로 LoginResult를 같이 써도 되지만,
// 명확히 구분하고 싶다면 아래처럼 정의하세요.
export interface ReissueResult {
  grantType: string;
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

/** 공통 API 응답 구조 (이미 있다면 유지!) */
export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
