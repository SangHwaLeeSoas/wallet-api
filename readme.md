# 서버 환경


## 버전 정보
- Node JS v18.16.0
- NPM 9.6.4

## 실행 환경
- dev : ganache 연동
- stage : Goerli testnet 연동
- product : ETH mainnet 연동 

## 서버 실행 (윈도우)
### 경로진입
cd .. ${WalletServer경로}
### npm 라이브러리 설치
npm install
### 서버 환경변수 세팅 (stage : 테스트넷, product : 메인넷)
set NODE_ENV=stage
### 서버 실행
npm start bin/www.js
### 서버 접속
http://localhost:3000


## 서버 실행 (리눅스)
### 경로진입
cd .. ${WalletServer경로}
### npm 라이브러리 설치
npm install
### 서버 환경변수 세팅 (stage : 테스트넷, product : 메인넷)
export NODE_ENV=stage
### 서버 실행
npm start bin/www.js
### 서버 접속
http://localhost:3000

# 참고 사항
## 테스트넷 배포할 때 변경
1. 환경변수 변경 (.env.stage 파일)
- CONTRACT_ADDRESS (컨트랙트 주소)
- OWNER_WALLET_ADDRESS (오너계정 주소)
- OWNER_WALLET_KEY (오너계정 키)
- HOT_WALLET_ADDRESS (핫월렛 주소)
- HOT_WALLET_KEY (핫월렛 키)

2. ABI 파일 변경
- resources/abi/stage.json 파일을 신규 ABI JSON 파일로 변경

## 메인넷 배포할 때 변경
1. 환경변수 변경 (.env.stage 파일)
- CONTRACT_ADDRESS (컨트랙트 주소)
- OWNER_WALLET_ADDRESS (오너계정 주소)
- OWNER_WALLET_KEY (오너계정 키)
- HOT_WALLET_ADDRESS (핫월렛 주소)
- HOT_WALLET_KEY (핫월렛 키)
- CHAIN_ID (이더리움 네트워크 체인 ID. 고에리 테스트넷: 5, 메인넷: 1)
- RPC_URL (Infura 메인넷 URL로 변경)

2. ABI 파일 변경
- resources/abi/stage.json 파일을 신규 ABI JSON 파일로 변경