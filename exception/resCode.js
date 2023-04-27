const resCode = {
    SUCCESS: { httpCode: 200, code: 'SUCCESS', message: '성공' },
    BAD_REQUEST: { httpCode: 400, code: 'BAD_REQUEST', message: '잘못된 요청입니다.' },
    INVALID_ADDRESS: { httpCode: 400, code: 'INVALID_ADDRESS', message: '잘못된 주소입니다.' },
    OUT_OF_GAS: { httpCode: 400, code: 'OUT_OF_GAS', message: '가스가 부족합니다.' },
    OUT_OF_AMOUNT: { httpCode: 400, code: 'OUT_OF_AMOUNT', message: '수량이 부족합니다.' },
    UNAUTHORIZED: { httpCode: 401, code: 'UNAUTHORIZED', message: '잘못된 권한입니다.' },
    NOT_FOUND: { httpCode: 404, code: 'NOT_FOUND', message: '찾을 수 없습니다.' },
    SERVER_ERROR: { httpCode: 500, code: 'SERVER_ERROR', message: '서버 에러' },
    RPC_ERROR: { httpCode: 500, code: 'RPC_ERROR', message: 'RPC 통신 에러' },

    create: (resCode, message) => ({ httpCode: resCode.httpCode, code: resCode.code, message : message || resCode.message }),
};


module.exports = resCode;