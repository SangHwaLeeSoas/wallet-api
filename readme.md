# 서버 환경


## 버전 정보
- Node JS v18.16.0
- NPM 9.6.4

## 실행 환경
- dev : ganache 연동
- stage : Goerli testnet 연동
- product : ETH mainnet 연동 

## 서버 실행

#경로진입
cd .. ${WalletServer경로}

#npm 라이브러리 설치
npm install

#서버 환경변수 세팅 (stage : 테스트넷, product : 메인넷)
set NODE_ENV=stage

#서버 실행
npm start bin/www.js 

# 서버 접속
http://localhost:3000