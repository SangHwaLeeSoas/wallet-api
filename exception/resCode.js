const resCode = {
    SUCCESS: { httpCode: 200, code: 'SUCCESS', message: '성공' },
    BAD_REQUEST: { httpCode: 400, code: 'BAD_REQUEST', message: '잘못된 요청입니다.' },
    UNAUTHORIZED: { httpCode: 401, code: 'UNAUTHORIZED', message: '잘못된 권한입니다.' },
    NOT_FOUND: { httpCode: 404, code: 'NOT_FOUND', message: '찾을 수 없습니다.' },
    SERVER_ERROR: { httpCode: 500, code: 'SERVER_ERROR', message: '서버 에러' },
    RPC_ERROR: { httpCode: 500, code: 'RPC_ERROR', message: 'RPC 통신 에러' },

    create: (resCode, message) => ({ httpCode: resCode.httpCode, code: resCode.code, message }),
};


module.exports = resCode;